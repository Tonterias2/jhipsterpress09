import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Vtopic } from 'app/shared/model/vtopic.model';
import { VtopicService } from './vtopic.service';
import { VtopicComponent } from './vtopic.component';
import { VtopicDetailComponent } from './vtopic-detail.component';
import { VtopicUpdateComponent } from './vtopic-update.component';
import { VtopicDeletePopupComponent } from './vtopic-delete-dialog.component';
import { IVtopic } from 'app/shared/model/vtopic.model';

@Injectable({ providedIn: 'root' })
export class VtopicResolve implements Resolve<IVtopic> {
    constructor(private service: VtopicService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Vtopic> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Vtopic>) => response.ok),
                map((vtopic: HttpResponse<Vtopic>) => vtopic.body)
            );
        }
        return of(new Vtopic());
    }
}

export const vtopicRoute: Routes = [
    {
        path: 'vtopic',
        component: VtopicComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'jhipsterpressApp.vtopic.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'vtopic/:id/view',
        component: VtopicDetailComponent,
        resolve: {
            vtopic: VtopicResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterpressApp.vtopic.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'vtopic/new',
        component: VtopicUpdateComponent,
        resolve: {
            vtopic: VtopicResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterpressApp.vtopic.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'vtopic/:id/edit',
        component: VtopicUpdateComponent,
        resolve: {
            vtopic: VtopicResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterpressApp.vtopic.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const vtopicPopupRoute: Routes = [
    {
        path: 'vtopic/:id/delete',
        component: VtopicDeletePopupComponent,
        resolve: {
            vtopic: VtopicResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'jhipsterpressApp.vtopic.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
