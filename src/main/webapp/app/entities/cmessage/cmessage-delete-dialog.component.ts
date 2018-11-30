import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICmessage } from 'app/shared/model/cmessage.model';
import { CmessageService } from './cmessage.service';

@Component({
    selector: 'jhi-cmessage-delete-dialog',
    templateUrl: './cmessage-delete-dialog.component.html'
})
export class CmessageDeleteDialogComponent {
    cmessage: ICmessage;

    constructor(private cmessageService: CmessageService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.cmessageService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'cmessageListModification',
                content: 'Deleted an cmessage'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-cmessage-delete-popup',
    template: ''
})
export class CmessageDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cmessage }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CmessageDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.cmessage = cmessage;
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
