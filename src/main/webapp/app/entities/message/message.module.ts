import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import { JhipsterpressAdminModule } from 'app/admin/admin.module';
import {
    MessageComponent,
    MessageDetailComponent,
    MessageUpdateComponent,
    MessageDeletePopupComponent,
    MessageDeleteDialogComponent,
    messageRoute,
    messagePopupRoute
} from './';

const ENTITY_STATES = [...messageRoute, ...messagePopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, JhipsterpressAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MessageComponent,
        MessageDetailComponent,
        MessageUpdateComponent,
        MessageDeleteDialogComponent,
        MessageDeletePopupComponent
    ],
    entryComponents: [MessageComponent, MessageUpdateComponent, MessageDeleteDialogComponent, MessageDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressMessageModule {}
