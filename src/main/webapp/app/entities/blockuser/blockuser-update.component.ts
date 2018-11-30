import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IBlockuser } from 'app/shared/model/blockuser.model';
import { BlockuserService } from './blockuser.service';
import { IUser, UserService } from 'app/core';
import { ICommunity } from 'app/shared/model/community.model';
import { CommunityService } from 'app/entities/community';

@Component({
    selector: 'jhi-blockuser-update',
    templateUrl: './blockuser-update.component.html'
})
export class BlockuserUpdateComponent implements OnInit {
    blockuser: IBlockuser;
    isSaving: boolean;

    users: IUser[];

    communities: ICommunity[];
    creationDate: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private blockuserService: BlockuserService,
        private userService: UserService,
        private communityService: CommunityService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ blockuser }) => {
            this.blockuser = blockuser;
            this.creationDate = this.blockuser.creationDate != null ? this.blockuser.creationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
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
        this.blockuser.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.blockuser.id !== undefined) {
            this.subscribeToSaveResponse(this.blockuserService.update(this.blockuser));
        } else {
            this.subscribeToSaveResponse(this.blockuserService.create(this.blockuser));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IBlockuser>>) {
        result.subscribe((res: HttpResponse<IBlockuser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCommunityById(index: number, item: ICommunity) {
        return item.id;
    }
}
