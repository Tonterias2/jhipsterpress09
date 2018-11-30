import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import { JhipsterpressAdminModule } from 'app/admin/admin.module';
import {
    UprofileComponent,
    UprofileDetailComponent,
    UprofileUpdateComponent,
    UprofileDeletePopupComponent,
    UprofileDeleteDialogComponent,
    uprofileRoute,
    uprofilePopupRoute
} from './';

const ENTITY_STATES = [...uprofileRoute, ...uprofilePopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, JhipsterpressAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        UprofileComponent,
        UprofileDetailComponent,
        UprofileUpdateComponent,
        UprofileDeleteDialogComponent,
        UprofileDeletePopupComponent
    ],
    entryComponents: [UprofileComponent, UprofileUpdateComponent, UprofileDeleteDialogComponent, UprofileDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressUprofileModule {}
