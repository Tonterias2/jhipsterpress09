import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IBlog } from 'app/shared/model/blog.model';
import { BlogService } from './blog.service';
import { ICommunity } from 'app/shared/model/community.model';
import { CommunityService } from 'app/entities/community';

import { Principal } from 'app/core';

@Component({
    selector: 'jhi-blog-update',
    templateUrl: './blog-update.component.html'
})
export class BlogUpdateComponent implements OnInit {
    blog: IBlog;
    isSaving: boolean;

    communities: ICommunity[];

    creationDate: string;
    currentAccount: any;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private blogService: BlogService,
        private communityService: CommunityService,
        private elementRef: ElementRef,
        private principal: Principal,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ blog }) => {
            this.blog = blog;
            this.creationDate = this.blog.creationDate != null ? this.blog.creationDate.format(DATE_TIME_FORMAT) : null;
        });
        this.principal.identity().then(account => {
            this.currentAccount = account;
            console.log('CONSOLOG: M:ngOnInit & O: this.currentAccount : ', this.currentAccount);
            const query = {};
            if (this.currentAccount.id != null) {
                query['userId.equals'] = this.currentAccount.id;
            }
            this.communityService.query(query).subscribe(
                (res: HttpResponse<ICommunity[]>) => {
                    this.communities = res.body;
                    console.log('CONSOLOG: M:ngOnInit & O: this.blog : ', this.communities);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
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
        this.dataUtils.clearInputImage(this.blog, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    myBlogs() {}

    save() {
        this.isSaving = true;
        this.blog.creationDate = this.creationDate != null ? moment(this.creationDate, DATE_TIME_FORMAT) : null;
        console.log('CONSOLOG: M:save & O: this.blog : ', this.blog);
        if (this.blog.id !== undefined) {
            this.subscribeToSaveResponse(this.blogService.update(this.blog));
        } else {
            this.subscribeToSaveResponse(this.blogService.create(this.blog));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IBlog>>) {
        result.subscribe((res: HttpResponse<IBlog>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
