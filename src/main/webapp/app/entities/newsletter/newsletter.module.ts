import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import {
    NewsletterComponent,
    NewsletterDetailComponent,
    NewsletterUpdateComponent,
    NewsletterDeletePopupComponent,
    NewsletterDeleteDialogComponent,
    newsletterRoute,
    newsletterPopupRoute
} from './';

const ENTITY_STATES = [...newsletterRoute, ...newsletterPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        NewsletterComponent,
        NewsletterDetailComponent,
        NewsletterUpdateComponent,
        NewsletterDeleteDialogComponent,
        NewsletterDeletePopupComponent
    ],
    entryComponents: [NewsletterComponent, NewsletterUpdateComponent, NewsletterDeleteDialogComponent, NewsletterDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressNewsletterModule {}
