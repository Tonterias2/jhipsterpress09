import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import { JhipsterpressAdminModule } from 'app/admin/admin.module';
import {
    BlockuserComponent,
    BlockinguserComponent,
    BlockeduserComponent,
    BlockuserDetailComponent,
    BlockuserUpdateComponent,
    BlockuserDeletePopupComponent,
    BlockuserDeleteDialogComponent,
    blockuserRoute,
    blockuserPopupRoute
} from './';

const ENTITY_STATES = [...blockuserRoute, ...blockuserPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, JhipsterpressAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        BlockuserComponent,
        BlockinguserComponent,
        BlockeduserComponent,
        BlockuserDetailComponent,
        BlockuserUpdateComponent,
        BlockuserDeleteDialogComponent,
        BlockuserDeletePopupComponent
    ],
    entryComponents: [BlockuserComponent, BlockuserUpdateComponent, BlockuserDeleteDialogComponent, BlockuserDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressBlockuserModule {}
