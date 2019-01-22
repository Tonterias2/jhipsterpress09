import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { INewsletter } from 'app/shared/model/newsletter.model';
import { NewsletterService } from '../../entities/newsletter/newsletter.service';

@Component({
    selector: 'jhi-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
    newsletter: INewsletter;
    //    private _newsletter: INewsletter;
    isSaving: boolean;
    creationDate: string;

    constructor(private newsletterService: NewsletterService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.creationDate = '';
        this.isSaving = false;
        this.creationDate = moment().format(DATE_TIME_FORMAT);
        this.newsletter = new Object();
        this.newsletter.creationDate = moment(this.creationDate);
        this.newsletter.email = '';
    }

    save() {
        this.isSaving = true;
        if (this.newsletter.id !== undefined) {
            this.subscribeToSaveResponse(this.newsletterService.update(this.newsletter));
        } else {
            this.subscribeToSaveResponse(this.newsletterService.create(this.newsletter));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<INewsletter>>) {
        result.subscribe((res: HttpResponse<INewsletter>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        //        this.newsletter.email = '';
        //        this.newsletterForm.reset();
        //        this.previousState(); poenemos un alert que diga que lo hemos recibido LLAMANDO al sistema de jhiAlert? o CUPEN solucion
    }

    private onSaveError() {
        this.isSaving = false;
    }

    //    get newsletter() {
    //        return this._newsletter;
    //    }
    //
    //    set newsletter(newsletter: INewsletter) {
    //        this.newsletter = newsletter;
    //        console.log('CONSOLOG: M:set newsletter & O: DATE_TIME_FORMAT : ', DATE_TIME_FORMAT);
    //        this.creationDate = moment([]).format(DATE_TIME_FORMAT);
    //        console.log('CONSOLOG: M:set newsletter & O: this.newsletter : ', this.creationDate);
    ////        this.newsletter.creationDate = this.creationDate;
    //        this.newsletter.email = '';
    //    }
}
