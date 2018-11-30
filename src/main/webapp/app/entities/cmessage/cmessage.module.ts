import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import {
    CmessageComponent,
    CmessageDetailComponent,
    CmessageUpdateComponent,
    CmessageDeletePopupComponent,
    CmessageDeleteDialogComponent,
    cmessageRoute,
    cmessagePopupRoute
} from './';

const ENTITY_STATES = [...cmessageRoute, ...cmessagePopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CmessageComponent,
        CmessageDetailComponent,
        CmessageUpdateComponent,
        CmessageDeleteDialogComponent,
        CmessageDeletePopupComponent
    ],
    entryComponents: [CmessageComponent, CmessageUpdateComponent, CmessageDeleteDialogComponent, CmessageDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressCmessageModule {}
