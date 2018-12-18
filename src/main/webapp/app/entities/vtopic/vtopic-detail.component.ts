import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVtopic } from 'app/shared/model/vtopic.model';

@Component({
    selector: 'jhi-vtopic-detail',
    templateUrl: './vtopic-detail.component.html'
})
export class VtopicDetailComponent implements OnInit {
    values = ['elemento1', 'elemento2'];
    vtopic: IVtopic;
    items = [];
    accc = true;
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ vtopic }) => {
            this.vtopic = vtopic;
        });
    }

    previousState() {
        window.history.back();
    }

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
}
