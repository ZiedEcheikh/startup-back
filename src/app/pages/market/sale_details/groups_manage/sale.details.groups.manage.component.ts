import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { MenuItem, MessageService } from 'primeng/api';

import { LoadingPageService } from '../../../../theme/loading/page/app.loading.page.service';
import {
  SaleDetailsService,
  MarketMenuService,
  SaleService,
} from '../../_service';

import { Sale, SaleDetails } from '../../_models';

import { ErrorCode } from '../../../../common';

@Component({
  selector: 'app-sale-group-details',
  templateUrl: './sale.details.groups.manage.component.html',
  styleUrls: ['./sale.details.groups.manage.component.scss'],
})
export class SaleDetailsGroupsManageComponent implements OnInit {

  itemsStepsMenu: MenuItem[];
  colsGroupsDetails: any[];

  fetchSaleId: number;
  fetchParentId: number;
  fetchIsSale = false;

  currentSale: Sale;
  currentSaleDetails: SaleDetails;
  currentGroupsDetails: SaleDetails[];

  selectedSaleDetail: SaleDetails;
  saleDetailsGoupToDelete: SaleDetails;

  display = false;
  indexSaleDetails = 0;

  constructor(
    private saleService: SaleService,
    private saleDetailsService: SaleDetailsService,
    private marketMenuService: MarketMenuService,
    private loadingPageService: LoadingPageService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadingPageService.present();
    this.initialize().subscribe(
      (parent) => {
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
      },
      (errors) => {
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
        if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
          this.router.navigate(['/administrator/market/sale-add']);
        }
      }
    );
  }

  private initialize() {
    this.itemsStepsMenu = this.marketMenuService.getItemsNewSaleSteps();
    this.colsGroupsDetails = [
      { field: 'label', header: 'Labelle' },
      { field: 'description', header: 'Description' },
    ];
    return this.route.queryParams.pipe(
      take(1),
      switchMap((params) => {
        this.fetchSaleId = params.saleId;
        if (this.fetchSaleId) {
          this.fetchParentId = params.parentId;
          this.fetchIsSale =
            params.nodeOfSale != null
              ? Boolean(JSON.parse(params.nodeOfSale))
              : false;
          return this.saleService.getSale(this.fetchSaleId);
        } else {
          this.router.navigate(['/administrator/market/sale-add']);
          return of(null);
        }
      }),
      take(1),
      switchMap((sale) => {
        this.currentSale = sale;
        if (this.fetchIsSale === true) {
          return this.saleDetailsService.getSaleDetailsBySaleId(
            this.fetchParentId
          );
        } else {
          this.fetchIsSale = false;
          return this.saleDetailsService.getSaleDetailsById(this.fetchParentId);
        }
      }),
      take(1),
      tap((data) => {
        if (this.fetchIsSale) {
          this.currentGroupsDetails = data;
        } else {
          this.currentSaleDetails = data;
          this.currentGroupsDetails = this.currentSaleDetails.children;
        }
      })
    );
  }
  /** Store */
  addGroupDetails() {
    const saleDetails = new SaleDetails();
    saleDetails.label = '';

    saleDetails.editable = true;
    saleDetails.actionStore = true;
    saleDetails.index = this.indexSaleDetails++;
    if (this.currentGroupsDetails == null) {
      this.currentGroupsDetails = new Array();
    }
    this.currentGroupsDetails.unshift(saleDetails);
  }

  confirmStoreGroupDetails(rowSaleDetails: SaleDetails) {
    if (this.fetchIsSale) {
      const sale = new Sale().buildSaleWithId(this.currentSale.id);
      rowSaleDetails.sale = sale;
    } else {
      const parentSaleDetail = new SaleDetails();
      parentSaleDetail.id = this.fetchParentId;
      rowSaleDetails.parent = parentSaleDetail;
    }

    let saleObs: Observable<SaleDetails>;
    saleObs = this.saleDetailsService.addSaleDetails(rowSaleDetails);
    saleObs.subscribe(
      (restData) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Service maket',
          detail: 'Groupe détails ajouté avec succès',
          life: 6000
        });
        rowSaleDetails.id = restData.id;
        rowSaleDetails.editable = false;
        rowSaleDetails.actionStore = false;
      },
      (errRes) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service market',
          detail: 'Probléme d\'ajout de groupe détails',
          life: 6000
        });
      }
    );
  }

  public ignoreStoreGroupDetails(rowSaleDetails: SaleDetails) {
    this.deleteGroupDetailsByIndex(rowSaleDetails.index);
    rowSaleDetails.actionStore = false;
  }

  private deleteGroupDetailsByIndex(index: number) {
    for (let _i = 0; _i < this.currentGroupsDetails.length; _i++) {
      if (this.currentGroupsDetails[_i].index === index) {
        this.currentGroupsDetails.splice(_i, 1);
      }
    }
  }

  /** Update */
  confirmUpdateSaleDetails(rowSaleDetails: SaleDetails) {
    let salProducteObs: Observable<SaleDetails>;
    salProducteObs = this.saleDetailsService.updateSaleDetails(rowSaleDetails);
    salProducteObs.subscribe(
      (restData) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Service maket',
          detail: 'Groupe détails mis à jour avec succès',
          life: 6000
        });
        rowSaleDetails.editable = false;
        rowSaleDetails.actionEdit = false;
      },
      (errRes) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service market',
          detail: 'Probléme de mise à jour de groupe détails',
          life: 6000
        });
      }
    );
  }

  public enableEditModeSaleDetails(rowSaleDetails: SaleDetails) {
    rowSaleDetails.editable = true;
    rowSaleDetails.actionEdit = true;
  }

  public disabelEditModeSaleDetails(rowProduct: SaleDetails) {
    rowProduct.editable = false;
    rowProduct.actionEdit = false;
  }

  /** delete */
  onDeleteGroupDetails() {
    this.display = false;
    let deleteObs: Observable<SaleDetails>;
    deleteObs = this.saleDetailsService.deleteSaleDetails(
      this.saleDetailsGoupToDelete.id
    );
    deleteObs.subscribe(
      (deletedSaleDetails) => {
        this.deleteGroupDetailsById(deletedSaleDetails.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Service maket',
          detail: 'Groupe détails supprimé avec succès',
          life: 6000
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service market',
          detail: 'Probléme de suppression de groupe détails',
          life: 6000
        });
      }
    );
  }

  confirmDeleteGroupDetails(saleDetails: SaleDetails) {
    this.saleDetailsGoupToDelete = saleDetails;
    this.display = true;
  }

  private deleteGroupDetailsById(id: number) {
    for (let _i = 0; _i < this.currentGroupsDetails.length; _i++) {
      if (this.currentGroupsDetails[_i].id === id) {
        this.currentGroupsDetails.splice(_i, 1);
      }
    }
  }
  /** Navigation */
  goSaleDetails() {
    this.router.navigate(['/administrator/market/sale-details'], {
      queryParams: { saleId: this.fetchSaleId },
    });
  }
}
