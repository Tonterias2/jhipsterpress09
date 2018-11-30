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

@Component({
    selector: 'jhi-cmessage-update',
    templateUrl: './cmessage-update.component.html'
})
export class CmessageUpdateComponent implements OnInit {
    cmessage: ICmessage;
    isSaving: boolean;

    communities: ICommunity[];
    creationDate: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private cmessageService: CmessageService,
        private communityService: CommunityService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cmessage }) => {
            this.cmessage = cmessage;
            this.creationDate = this.cmessage.creationDate != null ? this.cmessage.creationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.communityService.query().subscribe(
            (res: HttpResponse<ICommunity[]>) => {
                this.communities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
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
            this.subscribeToSaveResponse(this.cmessageService.create(this.cmessage));
        }
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

    trackCommunityById(index: number, item: ICommunity) {
        return item.id;
    }
}
