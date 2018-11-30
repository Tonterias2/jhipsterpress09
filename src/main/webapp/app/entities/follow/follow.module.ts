import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterpressSharedModule } from 'app/shared';
import { JhipsterpressAdminModule } from 'app/admin/admin.module';
import {
    FollowComponent,
    FollowingComponent,
    FollowerComponent,
    FollowDetailComponent,
    FollowUpdateComponent,
    FollowDeletePopupComponent,
    FollowDeleteDialogComponent,
    followRoute,
    followPopupRoute
} from './';

const ENTITY_STATES = [...followRoute, ...followPopupRoute];

@NgModule({
    imports: [JhipsterpressSharedModule, JhipsterpressAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        FollowComponent,
        FollowingComponent,
        FollowerComponent,
        FollowDetailComponent,
        FollowUpdateComponent,
        FollowDeleteDialogComponent,
        FollowDeletePopupComponent
    ],
    entryComponents: [
        FollowComponent,
        FollowingComponent,
        FollowerComponent,
        FollowUpdateComponent,
        FollowDeleteDialogComponent,
        FollowDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressFollowModule {}
