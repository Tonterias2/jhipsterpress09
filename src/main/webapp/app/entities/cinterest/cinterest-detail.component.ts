import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICinterest } from 'app/shared/model/cinterest.model';

@Component({
    selector: 'jhi-cinterest-detail',
    templateUrl: './cinterest-detail.component.html'
})
export class CinterestDetailComponent implements OnInit {
    cinterest: ICinterest;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cinterest }) => {
            this.cinterest = cinterest;
            //            console.log('CONSOLOG: M:ngOnInit & O: this.cinterest : ', this.cinterest);
        });
    }

    previousState() {
        window.history.back();
    }
}
