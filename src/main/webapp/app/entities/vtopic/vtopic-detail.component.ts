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
    values = ['elemento1', 'elemento2'];
    vtopic: IVtopic;
    vquestions: IVquestion[];
    items = [];
    accc = true;

    itemsPerPage: any;
    page: any;
    predicate: any;
    //    previousPage: any;
    reverse: any;

    constructor(
        private vquestionService: VquestionService,
        private jhiAlertService: JhiAlertService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ vtopic }) => {
            this.vtopic = vtopic;
            this.vquestionService
                .query({
                    //                page: this.page - 1,
                    //                size: this.itemsPerPage,
                    //                sort: this.sort()
                })
                .subscribe(
                    (res: HttpResponse<IVquestion[]>) => {
                        this.vquestions = res.body;
                        console.log('CONSOLOG: M:ngOnInit & O: this.vquestions : ', this.vquestions);
                    },
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
        });
    }

    previousState() {
        window.history.back();
    }
    // *************************************************************************************************************
    agregar(i) {
        if (this.items.includes(i)) {
            this.items.splice(i, 1);
        } else {
            this.items.push(i);
        }
    }

    mostrar(i) {
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
