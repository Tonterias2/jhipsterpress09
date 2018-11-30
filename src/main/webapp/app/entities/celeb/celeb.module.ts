import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import {
    CelebComponent,
    CelebDetailComponent,
    CelebUpdateComponent,
    CelebDeletePopupComponent,
    CelebDeleteDialogComponent,
    celebRoute,
    celebPopupRoute
} from './';

const ENTITY_STATES = [...celebRoute, ...celebPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [CelebComponent, CelebDetailComponent, CelebUpdateComponent, CelebDeleteDialogComponent, CelebDeletePopupComponent],
    entryComponents: [CelebComponent, CelebUpdateComponent, CelebDeleteDialogComponent, CelebDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressCelebModule {}
