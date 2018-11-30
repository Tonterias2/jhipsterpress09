import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICceleb } from 'app/shared/model/cceleb.model';
import { CcelebService } from './cceleb.service';

@Component({
    selector: 'jhi-cceleb-delete-dialog',
    templateUrl: './cceleb-delete-dialog.component.html'
})
export class CcelebDeleteDialogComponent {
    cceleb: ICceleb;

    constructor(private ccelebService: CcelebService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.ccelebService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'ccelebListModification',
                content: 'Deleted an cceleb'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-cceleb-delete-popup',
    template: ''
})
export class CcelebDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cceleb }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CcelebDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.cceleb = cceleb;
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
