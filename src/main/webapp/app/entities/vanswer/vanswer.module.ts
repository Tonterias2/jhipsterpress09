import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import { JhipsterpressAdminModule } from 'app/admin/admin.module';
import {
    VanswerComponent,
    VanswerDetailComponent,
    VanswerUpdateComponent,
    VanswerDeletePopupComponent,
    VanswerDeleteDialogComponent,
    vanswerRoute,
    vanswerPopupRoute
} from './';

const ENTITY_STATES = [...vanswerRoute, ...vanswerPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, JhipsterpressAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        VanswerComponent,
        VanswerDetailComponent,
        VanswerUpdateComponent,
        VanswerDeleteDialogComponent,
        VanswerDeletePopupComponent
    ],
    entryComponents: [VanswerComponent, VanswerUpdateComponent, VanswerDeleteDialogComponent, VanswerDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressVanswerModule {}
