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
    isSaving: boolean;
    creationDate: string;

    constructor(private newsletterService: NewsletterService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        //        this.activatedRoute.data.subscribe(({ newsletter }) => {
        //            this.newsletter = newsletter;
        //            console.log('CONSOLOG: M:ngOnInit & O: this.newsletter : ', this.newsletter);
        //            this.creationDate = this.newsletter.creationDate != null ? this.newsletter.creationDate.format(DATE_TIME_FORMAT) : null;
        //        });
        this.newsletter = new Object();
    }

    save() {
        this.isSaving = true;
        console.log('CONSOLOG: M:saveNewsletter & O: this.newsletter : ', this.newsletter);
        this.newsletter.creationDate = moment(this.creationDate, DATE_TIME_FORMAT);
        //        this.newsletter.creationDate = this.creationDate != null ? moment( this.creationDate, DATE_TIME_FORMAT ) : null;
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
        //        this.previousState(); poenemos un alert que diga que lo hemos recibido LLAMANDO al sistema de jhiAlert? o CUPEN solucion
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
