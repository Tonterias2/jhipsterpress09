import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IVthumb } from 'app/shared/model/vthumb.model';
import { VthumbService } from './vthumb.service';
import { IUser, UserService } from 'app/core';
import { IVquestion } from 'app/shared/model/vquestion.model';
import { VquestionService } from 'app/entities/vquestion';
import { IVanswer } from 'app/shared/model/vanswer.model';
import { VanswerService } from 'app/entities/vanswer';

@Component({
    selector: 'jhi-vthumb-update',
    templateUrl: './vthumb-update.component.html'
})
export class VthumbUpdateComponent implements OnInit {
    vthumb: IVthumb;
    isSaving: boolean;

    users: IUser[];

    vquestions: IVquestion[];

    vanswers: IVanswer[];
    creationDate: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private vthumbService: VthumbService,
        private userService: UserService,
        private vquestionService: VquestionService,
        private vanswerService: VanswerService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ vthumb }) => {
            this.vthumb = vthumb;
            this.creationDate = this.vthumb.creationDate != null ? this.vthumb.creationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.vquestionService.query().subscribe(
            (res: HttpResponse<IVquestion[]>) => {
                this.vquestions = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.vanswerService.query().subscribe(
            (res: HttpResponse<IVanswer[]>) => {
                this.vanswers = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.vthumb.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.vthumb.id !== undefined) {
            this.subscribeToSaveResponse(this.vthumbService.update(this.vthumb));
        } else {
            this.subscribeToSaveResponse(this.vthumbService.create(this.vthumb));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IVthumb>>) {
        result.subscribe((res: HttpResponse<IVthumb>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackVquestionById(index: number, item: IVquestion) {
        return item.id;
    }

    trackVanswerById(index: number, item: IVanswer) {
        return item.id;
    }
}
