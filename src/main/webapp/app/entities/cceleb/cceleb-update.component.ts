import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ICceleb } from 'app/shared/model/cceleb.model';
import { CcelebService } from './cceleb.service';
import { ICommunity } from 'app/shared/model/community.model';
import { CommunityService } from 'app/entities/community';

@Component({
    selector: 'jhi-cceleb-update',
    templateUrl: './cceleb-update.component.html'
})
export class CcelebUpdateComponent implements OnInit {
    cceleb: ICceleb;
    isSaving: boolean;

    communities: ICommunity[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private ccelebService: CcelebService,
        private communityService: CommunityService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cceleb }) => {
            this.cceleb = cceleb;
        });
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
        if (this.cceleb.id !== undefined) {
            this.subscribeToSaveResponse(this.ccelebService.update(this.cceleb));
        } else {
            this.subscribeToSaveResponse(this.ccelebService.create(this.cceleb));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICceleb>>) {
        result.subscribe((res: HttpResponse<ICceleb>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
