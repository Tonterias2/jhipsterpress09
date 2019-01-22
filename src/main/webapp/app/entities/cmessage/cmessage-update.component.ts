import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { ICmessage } from 'app/shared/model/cmessage.model';
import { CmessageService } from './cmessage.service';
import { ICommunity } from 'app/shared/model/community.model';
import { CommunityService } from 'app/entities/community';
import { IUser, UserService } from 'app/core';
import { IFollow } from 'app/shared/model/follow.model';
import { FollowService } from '../follow/follow.service';
import { IBlockuser } from 'app/shared/model/blockuser.model';
import { BlockuserService } from '../blockuser/blockuser.service';

import { Principal } from 'app/core';

@Component({
    selector: 'jhi-cmessage-update',
    templateUrl: './cmessage-update.component.html'
})
export class CmessageUpdateComponent implements OnInit {
    //    cmessage: ICmessage;
    private _cmessage: ICmessage;
    isSaving: boolean;

    communities: ICommunity[] = [];
    community: ICommunity[];

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
        private cmessageService: CmessageService,
        private userService: UserService,
        private followService: FollowService,
        private blockuserService: BlockuserService,
        private principal: Principal,
        private communityService: CommunityService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.communityIdEquals != null) {
                this.nameParamFollows = 'communityId';
                this.valueParamFollows = params.communityIdEquals;
                console.log(
                    'CONSOLOG: M:Constructor & O: this.activatedRoute.queryParams : ',
                    this.nameParamFollows,
                    this.valueParamFollows
                );
            }
        });
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cmessage }) => {
            this.cmessage = cmessage;
            this.creationDate = moment().format(DATE_TIME_FORMAT);
            this.cmessage.creationDate = moment(this.creationDate);
            console.log('CONSOLOG: M:ngOnInit & O: this.cmessage : ', this.cmessage);
            this.cmessage.creceiverId = Number(this.valueParamFollows);
        });
        this.principal.identity().then(account => {
            this.currentAccount = account;
            this.cmessage.csenderId = this.currentAccount.id;
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
        this.cmessage.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.cmessage.id !== undefined) {
            this.subscribeToSaveResponse(this.cmessageService.update(this.cmessage));
        } else {
            if (this.cmessage.creceiverId !== undefined) {
                if (this.isBlocked === false) {
                    console.log('CONSOLOG: M:save & O: this.isBlockUser.length : NO-BLOCKED ', this.isBlockUser.length);
                    this.subscribeToSaveResponse(this.cmessageService.create(this.cmessage));
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
            //            this.subscribeToSaveResponse(this.cmessageService.create(this.cmessage));
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICmessage>>) {
        result.subscribe((res: HttpResponse<ICmessage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCommunityById(index: number, item: ICommunity) {
        return item.id;
    }

    get cmessage() {
        return this._cmessage;
    }

    set cmessage(cmessage: ICmessage) {
        this._cmessage = cmessage;
        this.creationDate = moment(cmessage.creationDate).format(DATE_TIME_FORMAT);
    }
}
