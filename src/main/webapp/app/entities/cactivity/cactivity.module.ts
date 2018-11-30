import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import {
    CactivityComponent,
    CactivityDetailComponent,
    CactivityUpdateComponent,
    CactivityDeletePopupComponent,
    CactivityDeleteDialogComponent,
    cactivityRoute,
    cactivityPopupRoute
} from './';

const ENTITY_STATES = [...cactivityRoute, ...cactivityPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CactivityComponent,
        CactivityDetailComponent,
        CactivityUpdateComponent,
        CactivityDeleteDialogComponent,
        CactivityDeletePopupComponent
    ],
    entryComponents: [CactivityComponent, CactivityUpdateComponent, CactivityDeleteDialogComponent, CactivityDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressCactivityModule {}
