import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ICommunity } from 'app/shared/model/community.model';
import { CommunityService } from './community.service';
import { IUser, UserService } from 'app/core';
import { ICinterest } from 'app/shared/model/cinterest.model';
import { CinterestService } from 'app/entities/cinterest';
import { ICactivity } from 'app/shared/model/cactivity.model';
import { CactivityService } from 'app/entities/cactivity';
import { ICceleb } from 'app/shared/model/cceleb.model';
import { CcelebService } from 'app/entities/cceleb';

@Component({
    selector: 'jhi-community-update',
    templateUrl: './community-update.component.html'
})
export class CommunityUpdateComponent implements OnInit {
    community: ICommunity;
    isSaving: boolean;

    users: IUser[];

    cinterests: ICinterest[];

    cactivities: ICactivity[];

    ccelebs: ICceleb[];
    creationDate: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private communityService: CommunityService,
        private userService: UserService,
        private cinterestService: CinterestService,
        private cactivityService: CactivityService,
        private ccelebService: CcelebService,
        private elementRef: ElementRef,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ community }) => {
            this.community = community;
            this.creationDate = this.community.creationDate != null ? this.community.creationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.cinterestService.query().subscribe(
            (res: HttpResponse<ICinterest[]>) => {
                this.cinterests = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.cactivityService.query().subscribe(
            (res: HttpResponse<ICactivity[]>) => {
                this.cactivities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.ccelebService.query().subscribe(
            (res: HttpResponse<ICceleb[]>) => {
                this.ccelebs = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
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
        this.dataUtils.clearInputImage(this.community, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.community.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.community.id !== undefined) {
            this.subscribeToSaveResponse(this.communityService.update(this.community));
        } else {
            this.subscribeToSaveResponse(this.communityService.create(this.community));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICommunity>>) {
        result.subscribe((res: HttpResponse<ICommunity>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCinterestById(index: number, item: ICinterest) {
        return item.id;
    }

    trackCactivityById(index: number, item: ICactivity) {
        return item.id;
    }

    trackCcelebById(index: number, item: ICceleb) {
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
