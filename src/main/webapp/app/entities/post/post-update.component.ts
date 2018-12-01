import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IPost } from 'app/shared/model/post.model';
import { PostService } from './post.service';
import { IUser, UserService } from 'app/core';
import { IBlog } from 'app/shared/model/blog.model';
import { BlogService } from 'app/entities/blog';
import { ITag } from 'app/shared/model/tag.model';
import { TagService } from 'app/entities/tag';
import { ITopic } from 'app/shared/model/topic.model';
import { TopicService } from 'app/entities/topic';

import { ICommunity } from 'app/shared/model/community.model';
import { CommunityService } from '../../entities/community/community.service';
import { Principal } from 'app/core';

@Component({
    selector: 'jhi-post-update',
    templateUrl: './post-update.component.html'
})
export class PostUpdateComponent implements OnInit {
    private _post: IPost;
    isSaving: boolean;

    users: IUser[] = [];
    user: IUser;

    blogs: IBlog[];

    tags: ITag[];

    topics: ITopic[];

    communities: ICommunity[];

    loggeUserdId: number;
    creationDate: string;
    publicationDate: string;
    currentAccount: any;
    userLogin: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private postService: PostService,
        private communityService: CommunityService,
        private userService: UserService,
        private blogService: BlogService,
        private tagService: TagService,
        private topicService: TopicService,
        private principal: Principal,
        private elementRef: ElementRef,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ post }) => {
            this.post = post;
            console.log('CONSOLOG: M:ngOnInit & O: this.post : ', this.post);
            this.creationDate = this.post.creationDate != null ? this.post.creationDate.format(DATE_TIME_FORMAT) : null;
            this.publicationDate = this.post.publicationDate != null ? this.post.publicationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.principal.identity().then(account => {
            this.currentAccount = account;
            this.loggeUserdId = this.currentAccount.id;
            console.log('CONSOLOG: M:ngOnInit & O: this.currentAccount : ', this.currentAccount);
            this.myCommunities(this.currentAccount);
            this.myUser();
        });
        this.tagService.query().subscribe(
            (res: HttpResponse<ITag[]>) => {
                this.tags = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.topicService.query().subscribe(
            (res: HttpResponse<ITopic[]>) => {
                this.topics = res.body;
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
        this.dataUtils.clearInputImage(this.post, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.post.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        this.post.publicationDate = this.publicationDate != null ? moment(this.publicationDate, DATE_TIME_FORMAT) : null;
        if (this.post.id !== undefined) {
            this.subscribeToSaveResponse(this.postService.update(this.post));
        } else {
            this.subscribeToSaveResponse(this.postService.create(this.post));
        }
    }

    private myCommunities(currentAccount) {
        const query = {};
        if (this.currentAccount.id != null) {
            query['userId.equals'] = this.currentAccount.id;
        }
        this.communityService.query(query).subscribe(
            (res: HttpResponse<ICommunity[]>) => {
                this.communities = res.body;
                console.log('CONSOLOG: M:myCommunities & O: this.communities : ', this.communities);
                this.communitiesBlogs(this.communities);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private communitiesBlogs(communities) {
        const query = {};
        if (this.communities != null) {
            const arrayCommmunities = [];
            this.communities.forEach(community => {
                arrayCommmunities.push(community.id);
            });
            query['communityId.in'] = arrayCommmunities;
        }
        this.blogService.query(query).subscribe(
            (res: HttpResponse<IBlog[]>) => {
                this.blogs = res.body;
                console.log('CONSOLOG: M:myCommunities & O: this.blogs : ', this.blogs);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private myUser() {
        console.log('CONSOLOG: M:myUser & ENTRANDO A MY USER!!!!!!!!!!!!! : ', this.post.userId);
        if (typeof this.post.userId === 'undefined' || this.loggeUserdId === null) {
            this.userService.findById(this.loggeUserdId).subscribe(
                (res: HttpResponse<IUser>) => {
                    this.users.push(res.body);
                    console.log('CONSOLOG: M:myUser & O: this.user : ', this.user);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        } else {
            this.userService.findById(this.post.userId).subscribe(
                (res: HttpResponse<IUser>) => {
                    this.users.push(res.body);
                    console.log('CONSOLOG: M:myUser & O: this.user : ', this.user);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>) {
        result.subscribe((res: HttpResponse<IPost>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackBlogById(index: number, item: IBlog) {
        return item.id;
    }

    trackTagById(index: number, item: ITag) {
        return item.id;
    }

    trackTopicById(index: number, item: ITopic) {
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

    get post() {
        return this._post;
    }

    set post(post: IPost) {
        this._post = post;
        this.creationDate = moment(post.creationDate).format(DATE_TIME_FORMAT);
        this.publicationDate = moment(post.publicationDate).format(DATE_TIME_FORMAT);
    }
}
