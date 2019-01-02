import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IMessage } from 'app/shared/model/message.model';
import { MessageService } from './message.service';
import { IUser, UserService } from 'app/core';
import { IFollow } from 'app/shared/model/follow.model';
import { FollowService } from '../follow/follow.service';
import { IBlockuser } from 'app/shared/model/blockuser.model';
import { BlockuserService } from '../blockuser/blockuser.service';
import { IUprofile } from 'app/shared/model/uprofile.model';
import { UprofileService } from '../uprofile/uprofile.service';

import { Principal } from 'app/core';

@Component({
    selector: 'jhi-message-update',
    templateUrl: './message-update.component.html'
})
export class MessageUpdateComponent implements OnInit {
    //    message: IMessage;
    private _message: IMessage;
    isSaving: boolean;

    users: IUser[] = [];
    user: IUser;
    uprofiles: IUprofile[];
    uprofile: IUprofile;

    creationDate: string;

    follows: IFollow[];
    loggedUser: IUser;
    blockusers: IBlockuser[];

    currentAccount: any;
    isBlocked: boolean;

    routeData: any;
    nameParamFollows: any;
    valueParamFollows: number;
    blockedByUser: string;

    alerts: any[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private messageService: MessageService,
        private userService: UserService,
        private uprofileService: UprofileService,
        private followService: FollowService,
        private blockuserService: BlockuserService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.uprofileIdEquals != null) {
                this.nameParamFollows = 'uprofileId';
                this.valueParamFollows = params.uprofileIdEquals;
                console.log('CONSOLOG: M:ngOnInit & O: this.activatedRoute.queryParams : ', this.nameParamFollows, this.valueParamFollows);
            }
        });
    }

    ngOnInit() {
        //        setInterval(() => {
        //            this.onWarning('BLOCKED BY USER');
        //            }, 5000);
        this.onWarning('BLOCKED BY USER');
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ message }) => {
            this.message = message;
            this.creationDate = this.message.creationDate != null ? this.message.creationDate.format(DATE_TIME_FORMAT) : null;
            const query = {};
            if (this.valueParamFollows != null) {
                query['id.equals'] = Number(this.valueParamFollows);
            }
            this.uprofileService.query(query).subscribe(
                (res: HttpResponse<IUprofile[]>) => {
                    this.message.receiverId = res.body[0].userId;
                    console.log('CONSOLOG: M:ngOnInit & O: this.message.receiverId:', this.message.receiverId);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        });
        this.principal.identity().then(account => {
            this.currentAccount = account;
            this.message.senderId = this.currentAccount.id;
            console.log('CONSOLOG: M:ngOnInit & O: this.currentAccount : ', this.currentAccount);
            //            this.myMessagesCommunities();
            //            this.currentLoggedUser();
            this.isBlockUser().subscribe(
                (res: HttpResponse<IBlockuser[]>) => {
                    this.blockusers = res.body;
                    console.log('CONSOLOG: M:currentLoggedProfile & O:  this.blockusers : ', this.blockusers);
                    if (this.blockusers.length > 0) {
                        this.isBlocked = true;
                        this.valueParamFollows = null;
                        this.onWarning('BLOCKED BY USER');
                        console.log('CONSOLOG: M:currentLoggedProfile & O:  this.isBlocked : ', this.isBlocked);
                        return this.blockusers[0];
                    }
                },
                (res3: HttpErrorResponse) => this.onError(res3.message)
            );
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.message.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.message.id !== undefined) {
            this.subscribeToSaveResponse(this.messageService.update(this.message));
        } else {
            if (this.message.receiverId !== undefined) {
                if (this.isBlocked === false) {
                    console.log('CONSOLOG: M:save & O: this.isBlockUser.length : NO-BLOCKED ', this.isBlockUser.length);
                    this.subscribeToSaveResponse(this.messageService.create(this.message));
                    //                    } else {
                    ////                        this.valueParamFollows = null;
                    ////                        this.jhiAlertService.error('BLOCKED BY USER', {type: 'warning', msg: 'BLOCKED BY USER'});
                    ////                        this.jhiAlertService.addAlert({type: 'warning', msg: 'BLOCKED BY USER', timeout: 10000}, []);
                    ////                        this.jhiAlertService.error(msg: 'BLOCKED BY USER');
                    //                        this.blockedByUser = 'BLOCKED BY USER';
                    //                        console.log('CONSOLOG: M:save & O: this.blockedByUser : ', this.blockedByUser);
                    ////                        this.onBlockedUserError(this.blockedByUser);
                }
            }
            //            this.subscribeToSaveResponse(this.messageService.create(this.message));
        }
    }

    private isBlockUser() {
        this.isBlocked = false;
        const query = {};
        if (this.currentAccount.id != null) {
            //            query['blockeduserId.in'] = this.loggedUser.id;
            //            query['blockinguserId.in'] = Number(this.valueParamFollows);
            //            query['blockeduserId.in'] = this.currentAccount.id;
            //            query['blockinguserId.in'] = this.message.receiverId;
            query['blockeduserId.in'] = Number(this.valueParamFollows);
            query['blockinguserId.in'] = this.currentAccount.id;
        }
        console.log('CONSOLOG: M:isBlockUser & O: query : ', query);
        return this.blockuserService.query(query);
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>) {
        result.subscribe((res: HttpResponse<IMessage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    private onWarning(errorMessage: string) {
        console.log('CONSOLOG: M:onWarning & O:  errorMessage : ', errorMessage);
        //        this.jhiAlertService.addAlert({type: 'warning', msg: errorMessage, timeout: 10000}, null, null);
        //                this.jhiAlertService.addAlert({type: 'warning', msg: errorMessage, timeout: 10000}, []);
        //        this.jhiAlertService.warning('TEST', {type: 'warning', msg: errorMessage});
        //        this.jhiAlertService.warning(errorMessage, null, null);
        //        this.jhiAlertService.addAlert(this.jhiAlertService.warning(errorMessage, null, null));
        // estas no dan errores
        //        this.jhiAlertService.addAlert({type: 'warning', msg: errorMessage, timeout: 5000}, []);
        //        this.jhiAlertService.addAlert({type: 'warning', msg: errorMessage, timeout: 5000}, null);
        this.alerts = [];
        //        this.jhiAlertService.warning(errorMessage);
        console.log('CONSOLOG: M:onWarning & O:  this.alerts : ', this.alerts);
        this.alerts.push(
            this.jhiAlertService.addAlert(
                {
                    type: 'info',
                    msg: errorMessage,
                    timeout: 5000,
                    toast: false,
                    scoped: true
                },
                this.alerts
            )
        );
        console.log('CONSOLOG: M:onWarning & O:  this.alerts2 : ', this.alerts);
    }
    //
    //    private onBlockedUserError(blockedByUser: string) {
    //        console.log('CONSOLOG: M:onBlockedUserError & O: this.blockedByUser : ', blockedByUser);
    //        this.jhiAlertService.info(blockedByUser, null, null);
    //    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    get message() {
        return this._message;
    }

    set message(message: IMessage) {
        this._message = message;
        this.creationDate = moment(message.creationDate).format(DATE_TIME_FORMAT);
    }
}
