import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IFollow } from 'app/shared/model/follow.model';
import { FollowService } from './follow.service';
import { IUser, UserService } from 'app/core';
import { ICommunity } from 'app/shared/model/community.model';
import { CommunityService } from 'app/entities/community';

@Component({
    selector: 'jhi-follow-update',
    templateUrl: './follow-update.component.html'
})
export class FollowUpdateComponent implements OnInit {
    follow: IFollow;
    isSaving: boolean;

    users: IUser[];

    communities: ICommunity[];
    creationDate: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private followService: FollowService,
        private userService: UserService,
        private communityService: CommunityService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ follow }) => {
            this.follow = follow;
            this.creationDate = this.follow.creationDate != null ? this.follow.creationDate.format(DATE_TIME_FORMAT) : null;
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
        this.follow.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        if (this.follow.id !== undefined) {
            this.subscribeToSaveResponse(this.followService.update(this.follow));
        } else {
            this.subscribeToSaveResponse(this.followService.create(this.follow));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IFollow>>) {
        result.subscribe((res: HttpResponse<IFollow>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
