import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IUprofile } from 'app/shared/model/uprofile.model';
import { UprofileService } from './uprofile.service';
import { IUser, UserService } from 'app/core';
import { IInterest } from 'app/shared/model/interest.model';
import { InterestService } from 'app/entities/interest';
import { IActivity } from 'app/shared/model/activity.model';
import { ActivityService } from 'app/entities/activity';
import { ICeleb } from 'app/shared/model/celeb.model';
import { CelebService } from 'app/entities/celeb';

import { Principal } from 'app/core';

@Component({
    selector: 'jhi-uprofile-update',
    templateUrl: './uprofile-update.component.html'
})
export class UprofileUpdateComponent implements OnInit {
    uprofile: IUprofile;
    isSaving: boolean;

    users: IUser[] = [];
    user: IUser;

    interests: IInterest[];

    activities: IActivity[];

    celebs: ICeleb[];
    creationDate: string;
    birthdate: string;

    currentAccount: any;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private uprofileService: UprofileService,
        private userService: UserService,
        private interestService: InterestService,
        private activityService: ActivityService,
        private celebService: CelebService,
        private elementRef: ElementRef,
        private principal: Principal,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ uprofile }) => {
            this.uprofile = uprofile;
            console.log('CONSOLOG: M:ngOnInit & O: this.uprofile : ', this.uprofile);
            this.creationDate = moment().format(DATE_TIME_FORMAT);
            this.uprofile.creationDate = moment(this.creationDate);
            this.birthdate = this.uprofile.birthdate != null ? this.uprofile.birthdate.format(DATE_TIME_FORMAT) : null;
            this.principal.identity().then(account => {
                this.currentAccount = account;
                console.log('CONSOLOG: M:ngOnInit & O: this.currentAccount : ', this.currentAccount);
                this.userService.findById(this.currentAccount.id).subscribe(
                    (res: HttpResponse<IUser>) => {
                        this.uprofile.userId = res.body.id;
                        console.log('CONSOLOG: M:ngOnInit & O: this.user : ', this.user);
                    },
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            });
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.uprofile, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.uprofile.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        this.uprofile.birthdate = this.birthdate != null ? moment(this.birthdate, DATE_TIME_FORMAT) : null;
        if (this.uprofile.id !== undefined) {
            this.subscribeToSaveResponse(this.uprofileService.update(this.uprofile));
        } else {
            this.subscribeToSaveResponse(this.uprofileService.create(this.uprofile));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUprofile>>) {
        result.subscribe((res: HttpResponse<IUprofile>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackInterestById(index: number, item: IInterest) {
        return item.id;
    }

    trackActivityById(index: number, item: IActivity) {
        return item.id;
    }

    trackCelebById(index: number, item: ICeleb) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
