import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import {
    CinterestComponent,
    CinterestDetailComponent,
    CinterestUpdateComponent,
    CinterestDeletePopupComponent,
    CinterestDeleteDialogComponent,
    cinterestRoute,
    cinterestPopupRoute
} from './';

const ENTITY_STATES = [...cinterestRoute, ...cinterestPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CinterestComponent,
        CinterestDetailComponent,
        CinterestUpdateComponent,
        CinterestDeleteDialogComponent,
        CinterestDeletePopupComponent
    ],
    entryComponents: [CinterestComponent, CinterestUpdateComponent, CinterestDeleteDialogComponent, CinterestDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressCinterestModule {}
