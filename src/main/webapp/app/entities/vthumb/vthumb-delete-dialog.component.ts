import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IVthumb } from 'app/shared/model/vthumb.model';
import { VthumbService } from './vthumb.service';

@Component({
    selector: 'jhi-vthumb-delete-dialog',
    templateUrl: './vthumb-delete-dialog.component.html'
})
export class VthumbDeleteDialogComponent {
    vthumb: IVthumb;

    constructor(private vthumbService: VthumbService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.vthumbService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'vthumbListModification',
                content: 'Deleted an vthumb'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-vthumb-delete-popup',
    template: ''
})
export class VthumbDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ vthumb }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(VthumbDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.vthumb = vthumb;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
