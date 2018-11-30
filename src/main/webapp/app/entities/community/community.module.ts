import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import { JhipsterpressAdminModule } from 'app/admin/admin.module';
import {
    CommunityComponent,
    CommunityDetailComponent,
    CommunityUpdateComponent,
    CommunityDeletePopupComponent,
    CommunityDeleteDialogComponent,
    communityRoute,
    communityPopupRoute
} from './';

const ENTITY_STATES = [...communityRoute, ...communityPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, JhipsterpressAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CommunityComponent,
        CommunityDetailComponent,
        CommunityUpdateComponent,
        CommunityDeleteDialogComponent,
        CommunityDeletePopupComponent
    ],
    entryComponents: [CommunityComponent, CommunityUpdateComponent, CommunityDeleteDialogComponent, CommunityDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressCommunityModule {}
