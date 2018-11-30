import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import {
    CcelebComponent,
    CcelebDetailComponent,
    CcelebUpdateComponent,
    CcelebDeletePopupComponent,
    CcelebDeleteDialogComponent,
    ccelebRoute,
    ccelebPopupRoute
} from './';

const ENTITY_STATES = [...ccelebRoute, ...ccelebPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [CcelebComponent, CcelebDetailComponent, CcelebUpdateComponent, CcelebDeleteDialogComponent, CcelebDeletePopupComponent],
    entryComponents: [CcelebComponent, CcelebUpdateComponent, CcelebDeleteDialogComponent, CcelebDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressCcelebModule {}
