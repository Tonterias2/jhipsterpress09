import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import { JhipsterpressAdminModule } from 'app/admin/admin.module';
import {
    VthumbComponent,
    VthumbDetailComponent,
    VthumbUpdateComponent,
    VthumbDeletePopupComponent,
    VthumbDeleteDialogComponent,
    vthumbRoute,
    vthumbPopupRoute
} from './';

const ENTITY_STATES = [...vthumbRoute, ...vthumbPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, JhipsterpressAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [VthumbComponent, VthumbDetailComponent, VthumbUpdateComponent, VthumbDeleteDialogComponent, VthumbDeletePopupComponent],
    entryComponents: [VthumbComponent, VthumbUpdateComponent, VthumbDeleteDialogComponent, VthumbDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressVthumbModule {}
