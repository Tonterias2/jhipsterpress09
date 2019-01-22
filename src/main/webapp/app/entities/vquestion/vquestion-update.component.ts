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

import { Principal } from 'app/core';

@Component({
    selector: 'jhi-vquestion-update',
    templateUrl: './vquestion-update.component.html'
})
export class VquestionUpdateComponent implements OnInit {
    vquestion: IVquestion;
    vquestions: IVquestion[];

    isSaving: boolean;

    users: IUser[];

    vtopics: IVtopic[];
    creationDate: string;

    //    owner: any;
    //    isAdmin: boolean;
    currentAccount: any;

    nameParamVtopic: any;
    valueParamVtopic: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private vquestionService: VquestionService,
        private principal: Principal,
        private userService: UserService,
        private vtopicService: VtopicService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.vtopicIdEquals != null) {
                this.nameParamVtopic = 'vtopicId.equals';
                this.valueParamVtopic = params.vtopicIdEquals;
            }
            console.log('CONSOLOG: M:constructor & O: activatedRoute : ', this.nameParamVtopic, ' : ', this.valueParamVtopic);
        });
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ vquestion }) => {
            this.vquestion = vquestion;
            this.creationDate = moment().format(DATE_TIME_FORMAT);
            this.vquestion.creationDate = moment(this.creationDate);
        });
        if (this.valueParamVtopic != null) {
            this.vquestion.vtopicId = this.valueParamVtopic;
            this.principal.identity().then(account => {
                //                this.currentAccount = account;
                this.vquestion.userId = account.id;
                console.log('CONSOLOG: M:ngOnInit & O: this.vquestion : ', this.vquestion);
                //                this.principal.hasAnyAuthority(['ROLE_ADMIN']).then(result => {
                //                    this.isAdmin = result;
                //                });
            });
            //            const query = {};
            //            query['vtopicId.equals'] = this.valueParamPost;
            //            this.vquestionService.query(query).subscribe(
            //                (res: HttpResponse<IVquestion[]>) => {
            //                    this.vquestions = res.body;
            //                    console.log('CONSOLOG: M:ngOnInit & O: this.vquestions : ', this.vquestions);
            //                },
            //                (res: HttpErrorResponse) => this.onError(res.message)
            //            );
        }
        //        this.userService.query().subscribe(
        //            (res: HttpResponse<IUser[]>) => {
        //                this.users = res.body;
        //            },
        //            (res: HttpErrorResponse) => this.onError(res.message)
        //        );
        //        this.vtopicService.query().subscribe(
        //            (res: HttpResponse<IVtopic[]>) => {
        //                this.vtopics = res.body;
        //            },
        //            (res: HttpErrorResponse) => this.onError(res.message)
        //        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.vquestion.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.vquestion.id !== undefined) {
            console.log('CONSOLOG: M:ngOnInit & O: this.vquestion : ', this.vquestion);
            this.subscribeToSaveResponse(this.vquestionService.update(this.vquestion));
        } else {
            console.log('CONSOLOG: M:ngOnInit & O: this.vquestion : ', this.vquestion);
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
