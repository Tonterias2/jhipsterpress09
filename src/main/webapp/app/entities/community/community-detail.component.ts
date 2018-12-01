import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { Principal } from 'app/core';

import { ICommunity } from 'app/shared/model/community.model';
import { IBlog } from 'app/shared/model/blog.model';
import { BlogService } from 'app/entities/blog';
import { IFollow } from 'app/shared/model/follow.model';
import { FollowService } from '../follow/follow.service';
import { IUprofile } from 'app/shared/model/uprofile.model';
import { UprofileService } from 'app/entities/uprofile';
import { INotification } from 'app/shared/model/notification.model';
import { NotificationService } from '../notification/notification.service';
import { IInterest } from 'app/shared/model/interest.model';
import { InterestService } from '../interest/interest.service';
import { IActivity } from 'app/shared/model/activity.model';
import { ActivityService } from '../activity/activity.service';
import { ICeleb } from 'app/shared/model/celeb.model';
import { CelebService } from '../celeb/celeb.service';

@Component({
    selector: 'jhi-community-detail',
    templateUrl: './community-detail.component.html'
})
export class CommunityDetailComponent implements OnInit {
    community: ICommunity;
    blogs: IBlog[];

    follows: IFollow[];
    private _follow: IFollow;

    profile: IUprofile;
    profiles: IUprofile[];

    interests: IInterest[];
    activities: IActivity[];
    celebs: ICeleb[];

    loggedProfile: IUprofile;

    currentAccount: any;
    isFollowing: boolean;

    loggedProfileId: number;
    creationDate: string;
    isSaving: boolean;

    userId: number;
    private _notification: INotification;
    notificationDate: string;
    notificationReason: any;

    constructor(
        private blogService: BlogService,
        private followService: FollowService,
        private uprofileService: UprofileService,
        private notificationService: NotificationService,
        private interestService: InterestService,
        private activityService: ActivityService,
        private celebService: CelebService,
        private dataUtils: JhiDataUtils,
        private principal: Principal,
        private jhiAlertService: JhiAlertService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ community }) => {
            this.community = community;
            this.communitiesBlogs(community);
            this.userId = community.userId;
            console.log('CONSOLOG: M:ngOnInit & O: this.community : ', this.community);
        });
        this.communityInterests();
        this.communityActivities();
        this.communityCelebs();
        this.principal.identity().then(account => {
            this.currentAccount = account;
            this.isFollower();
        });
        this.isSaving = false;
        this.follow = new Object();
    }

    private communitiesBlogs(community) {
        const query = {};
        if (this.community != null) {
            query['communityId.in'] = community.id;
        }
        this.blogService.query(query).subscribe(
            (res: HttpResponse<IBlog[]>) => {
                this.blogs = res.body;
                console.log('CONSOLOG: M:communitiesBlogs & O: this.blogs : ', this.blogs);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private communityInterests() {
        const query2 = {};
        query2['communityId.equals'] = this.community.id;
        return this.interestService.query(query2).subscribe(
            (res: HttpResponse<IInterest[]>) => {
                this.interests = res.body;
                console.log('CONSOLOG: M:umxmInterests & O: this.interests : ', this.interests);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private communityActivities() {
        const query3 = {};
        query3['communityId.equals'] = this.community.id;
        return this.activityService.query(query3).subscribe(
            (res: HttpResponse<IActivity[]>) => {
                this.activities = res.body;
                console.log('CONSOLOG: M:umxmActivities & O: this.activities : ', this.activities);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private communityCelebs() {
        const query4 = {};
        query4['communityId.equals'] = this.community.id;
        return this.celebService.query(query4).subscribe(
            (res: HttpResponse<ICeleb[]>) => {
                this.celebs = res.body;
                console.log('CONSOLOG: M:umxmCelebs & O: this.celebs : ', this.celebs);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private isFollower() {
        this.isFollowing = false;
        const query = {};
        if (this.currentAccount.id != null) {
            query['followedId.in'] = this.currentAccount.id;
            query['cfollowingId.in'] = this.community.id;
        }
        this.followService.query(query).subscribe(
            (res: HttpResponse<IFollow[]>) => {
                this.follows = res.body;
                console.log('CONSOLOG: M:isFollower & O: this.follows : ', this.follows);
                if (this.follows.length > 0) {
                    this.isFollowing = true;
                    return this.follows[0];
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        console.log('CONSOLOG: M:isFollower & O: this.isFollowing : ', this.isFollowing);
    }

    following() {
        this.isSaving = true;
        this.follow.creationDate = moment(this.creationDate, DATE_TIME_FORMAT);
        this.follow.followedId = this.currentAccount.id;
        this.follow.cfollowingId = this.community.id;
        if (this.isFollowing === false) {
            console.log('CONSOLOG: M:following & O: this.follow : ', this.follow);
            this.subscribeToSaveResponse(this.followService.create(this.follow));
            this.notificationReason = 'FOLLOWING';
            this.createNotification(this.notificationReason);
            this.isFollowing = true;
            this.reload();
        }
    }

    unFollowing() {
        if (this.isFollowing === true) {
            this.isFollower();
            console.log('CONSOLOG: M:unFollowing & O: this.follows[0].id : ', this.follows[0].id);
            this.followService.delete(this.follows[0].id).subscribe(response => {
                this.notificationReason = 'UNFOLLOWING';
                this.createNotification(this.notificationReason);
            });
            this.reload();
        }
    }

    deleteItemFromList() {
        console.log('CONSOLOG: M:deleteItemFromList : ');
    }

    private createNotification(notificationReason) {
        this.notification = new Object();
        console.log('CONSOLOG: M:createNotification & O: this.notification : ', this.notification);
        console.log('CONSOLOG: M:createNotification & O: this.userId : ', this.userId);
        this.isSaving = true;
        this.notification.creationDate = moment(this.creationDate, DATE_TIME_FORMAT);
        this.notification.notificationDate = moment(this.creationDate, DATE_TIME_FORMAT);
        this.notification.notificationReason = notificationReason;
        //        this.notification.notificationText = notificationReason + ': ' + this.profile.lastName + ' ' + profile.lastName;
        this.notification.notificationText = notificationReason;
        this.notification.isDelivered = false;
        this.notification.userId = this.userId;
        if (this.notification.id !== undefined) {
            this.subscribeToSaveResponse2(this.notificationService.update(this.notification));
        } else {
            console.log('CONSOLOG: M:createNotification & O: this.notification: ', this.notification);
            this.subscribeToSaveResponse2(this.notificationService.create(this.notification));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IFollow>>) {
        result.subscribe((res: HttpResponse<IFollow>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private subscribeToSaveResponse2(result: Observable<HttpResponse<INotification>>) {
        result.subscribe((res: HttpResponse<INotification>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    reload() {
        window.location.reload();
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    get follow() {
        return this._follow;
    }

    set follow(follow: IFollow) {
        this._follow = follow;
        this.creationDate = moment().format(DATE_TIME_FORMAT);
    }

    get notification() {
        return this._notification;
    }

    set notification(notification: INotification) {
        this._notification = notification;
        this.creationDate = moment().format(DATE_TIME_FORMAT);
        this.notificationDate = moment().format(DATE_TIME_FORMAT);
        this.notificationReason = '';
    }
}
