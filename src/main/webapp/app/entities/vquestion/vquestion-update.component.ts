import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IVquestion } from 'app/shared/model/vquestion.model';
import { VquestionService } from './vquestion.service';
import { IUser, UserService } from 'app/core';
import { IVtopic } from 'app/shared/model/vtopic.model';
import { VtopicService } from 'app/entities/vtopic';

@Component({
    selector: 'jhi-vquestion-update',
    templateUrl: './vquestion-update.component.html'
})
export class VquestionUpdateComponent implements OnInit {
    vquestion: IVquestion;
    isSaving: boolean;

    users: IUser[];

    vtopics: IVtopic[];
    creationDate: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private vquestionService: VquestionService,
        private userService: UserService,
        private vtopicService: VtopicService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ vquestion }) => {
            this.vquestion = vquestion;
            this.creationDate = this.vquestion.creationDate != null ? this.vquestion.creationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.vtopicService.query().subscribe(
            (res: HttpResponse<IVtopic[]>) => {
                this.vtopics = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.vquestion.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.vquestion.id !== undefined) {
            this.subscribeToSaveResponse(this.vquestionService.update(this.vquestion));
        } else {
            this.subscribeToSaveResponse(this.vquestionService.create(this.vquestion));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IVquestion>>) {
        result.subscribe((res: HttpResponse<IVquestion>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackVtopicById(index: number, item: IVtopic) {
        return item.id;
    }
}
