import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import { JhipsterpressAdminModule } from 'app/admin/admin.module';
import {
    VtopicComponent,
    VtopicDetailComponent,
    VtopicUpdateComponent,
    VtopicDeletePopupComponent,
    VtopicDeleteDialogComponent,
    vtopicRoute,
    vtopicPopupRoute
} from './';

const ENTITY_STATES = [...vtopicRoute, ...vtopicPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, JhipsterpressAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [VtopicComponent, VtopicDetailComponent, VtopicUpdateComponent, VtopicDeleteDialogComponent, VtopicDeletePopupComponent],
    entryComponents: [VtopicComponent, VtopicUpdateComponent, VtopicDeleteDialogComponent, VtopicDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressVtopicModule {}
