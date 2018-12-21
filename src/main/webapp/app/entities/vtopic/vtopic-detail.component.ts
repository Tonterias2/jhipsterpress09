import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IVtopic } from 'app/shared/model/vtopic.model';
import { IVquestion } from 'app/shared/model/vquestion.model';
import { VquestionService } from '../vquestion/vquestion.service';

@Component({
    selector: 'jhi-vtopic-detail',
    templateUrl: './vtopic-detail.component.html'
})
export class VtopicDetailComponent implements OnInit {
    values: IVquestion[];
    vtopic: IVtopic;
    vquestions: IVquestion[];
    items = [];
    accc = true;

    itemsPerPage: any;
    page: any;
    predicate: any;

    reverse: any;

    constructor(
        private vquestionService: VquestionService,
        private jhiAlertService: JhiAlertService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ vtopic }) => {
            this.vtopic = vtopic;
            const query = {
                //                    page: this.page - 1,
                //                    size: this.itemsPerPage,
                //                    sort: this.sort()
            };
            if (this.vtopic != null) {
                query['vtopicId.equals'] = vtopic.id;
            }
            this.vquestionService.query(query).subscribe(
                (res: HttpResponse<IVquestion[]>) => {
                    this.vquestions = res.body;
                    console.log('CONSOLOG: M:ngOnInit & O: this.vquestions : ', this.vquestions);
                    //                        this.paginatePosts(res.body, res.headers);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        });
    }

    previousState() {
        window.history.back();
    }
    // *************************************************************************************************************
    accordionAddItem(i) {
        if (this.items.includes(i)) {
            this.items.splice(i, 1);
        } else {
            this.items.push(i);
        }
    }

    accordionShowItem(i) {
        return this.items.includes(i);
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
