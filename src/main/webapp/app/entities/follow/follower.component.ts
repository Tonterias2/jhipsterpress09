import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IFollow } from 'app/shared/model/follow.model';
import { Principal } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { FollowService } from './follow.service';

@Component({
    selector: 'jhi-follow',
    templateUrl: './follower.component.html'
})
export class FollowerComponent implements OnInit, OnDestroy {
    currentAccount: any;
    follows: IFollow[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    nameParamFollows: any;
    valueParamFollows: any;
    zipZeroResults: any;

    constructor(
        private followService: FollowService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.followingIdEquals != null) {
                this.nameParamFollows = 'followingId.equals';
                this.valueParamFollows = params.followingIdEquals;
            }
            if (params.cfollowingIdEquals != null) {
                this.nameParamFollows = 'cfollowingId.equals';
                this.valueParamFollows = params.cfollowingIdEquals;
            }
        });
    }

    loadAll() {
        const query = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
        };
        query[this.nameParamFollows] = this.valueParamFollows;
        this.followService
            .query(query)
            .subscribe(
                (res: HttpResponse<IFollow[]>) => this.paginateFollows(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        console.log('CONSOLOG: M:loadAll & O: this.query : ', query);
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/follow'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate([
            '/follow',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInFollows();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IFollow) {
        return item.id;
    }

    registerChangeInFollows() {
        this.eventSubscriber = this.eventManager.subscribe('followListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private paginateFollows(data: IFollow[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.follows = data;
        console.log('CONSOLOG: M:paginateFollows & O: this.follows : ', this.follows);
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
