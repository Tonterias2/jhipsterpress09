import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ICinterest } from 'app/shared/model/cinterest.model';
import { CinterestService } from './cinterest.service';
import { ICommunity } from 'app/shared/model/community.model';
import { CommunityService } from 'app/entities/community';

import { Principal } from 'app/core';

@Component({
    selector: 'jhi-cinterest-update',
    templateUrl: './cinterest-update.component.html'
})
export class CinterestUpdateComponent implements OnInit {
    cinterest: ICinterest;
    isSaving: boolean;

    communities: ICommunity[];

    currentAccount: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private cinterestService: CinterestService,
        private communityService: CommunityService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cinterest }) => {
            this.cinterest = cinterest;
        });
        this.principal.identity().then(account => {
            this.currentAccount = account;
            this.myCommunityCinterests(this.currentAccount);
        });
    }

    private myCommunityCinterests(currentAccount) {
        const query = {};
        if (this.currentAccount.id != null) {
            query['userId.equals'] = this.currentAccount.id;
        }
        this.communityService.query(query).subscribe(
            (res: HttpResponse<ICommunity[]>) => {
                this.communities = res.body;
                console.log('CONSOLOG: M:myUserActivities & O: res.body : ', res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.cinterest.id !== undefined) {
            this.subscribeToSaveResponse(this.cinterestService.update(this.cinterest));
        } else {
            this.subscribeToSaveResponse(this.cinterestService.create(this.cinterest));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICinterest>>) {
        result.subscribe((res: HttpResponse<ICinterest>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
