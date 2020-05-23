import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { SaleDetailsService, MarketMenuService, SaleService } from '../_service';
import { Router, ActivatedRoute } from '@angular/router';
import { take, switchMap, tap } from 'rxjs/operators';
import { Sale } from '../_models';
import { SaleDetails } from '../_models/sale.details.model';
import { ErrorCode } from 'src/app/common';
import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.details.manage.component.html',
  styleUrls: ['./sale.details.manage.component.scss']
})

export class SaleDetailsManageComponent implements OnInit {
  stepsItems: MenuItem[];
  cols: any[];
  isSale = false;
  parentId: number;
  currentSale: Sale;
  selectedSaleDetail: Sale;
  currentSaleDetails: SaleDetails;
  listDetails: SaleDetails[];
  selectedDetail: SaleDetails;
  saleDetailsToDelete: SaleDetails;
  fetchSaleId: number;
  display = false;
  indexSaleDetails = 0;
  constructor(private saleService: SaleService,
              private saleDetailsService: SaleDetailsService,
              private marketMenuService: MarketMenuService,
              private route: ActivatedRoute, private router: Router,
              private loadingPageService: LoadingPageService) {
    this.stepsItems = this.marketMenuService.getItemsNewSaleSteps();

    this.cols = [
      { field: 'label', header: 'Labelle' },
      { field: 'description', header: 'Description' }
    ];
  }

  ngOnInit() {
    this.initialize().subscribe(parent => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    },
      errors => {
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
        if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
          this.router.navigate(['/administrator/market/sale-add']);
        }
      }
    );
  }

  initialize() {
    this.loadingPageService.present();
    return this.route.queryParams.pipe(
      take(1),
      switchMap(params => {
        this.fetchSaleId = params.saleId; // TODO : check retrieve sale id or redirecte
        this.parentId = params.parentId;
        this.isSale = params.nodeOfSale != null ? Boolean(JSON.parse(params.nodeOfSale)) : false;
        return this.saleService.getSale(this.fetchSaleId);
      }),
      take(1),
      switchMap(sale => {
        this.currentSale = sale;
        if (this.isSale === true) {
          return this.saleDetailsService.getSaleDetailsBySaleId(this.parentId);
        } else {
          this.isSale = false;
          return this.saleDetailsService.getSaleDetailsById(this.parentId);
        }
      }),
      take(1),
      tap(data => {
        if (this.isSale) {
          this.listDetails = data;
        } else {
          this.currentSaleDetails = data;
          this.listDetails = this.currentSaleDetails.children;
        }
      })
    );
  }

  onDeleteGroupDetails() {
    this.display = false;
    this.loadingPageService.present();
    let deleteObs: Observable<SaleDetails>;
    deleteObs = this.saleDetailsService.deleteSaleDetails(this.saleDetailsToDelete.id);
    deleteObs.subscribe(deletedSaleDetails => {
      this.ngOnInit();
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    }, err => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    });
  }

  confirmDeleteGroupDetails(saleDetails: SaleDetails) {
    this.saleDetailsToDelete = saleDetails;
    this.display = true;
  }


  public enableEditModeSaleDetails(rowSaleDetails: SaleDetails) {
    rowSaleDetails.editable = true;
    rowSaleDetails.actionEdit = true;
  }

  public disabelEditModeSaleDetails(rowProduct: SaleDetails) {
    rowProduct.editable = false;
    rowProduct.actionEdit = false;
  }

  confirmUpdateSaleDetails(rowSaleDetails: SaleDetails) {
    let salProducteObs: Observable<SaleDetails>;
    salProducteObs = this.saleDetailsService.updateSaleDetails(rowSaleDetails);
    salProducteObs.subscribe(restData => {
      rowSaleDetails.editable = false;
      rowSaleDetails.actionEdit = false;
    }, errRes => {
    });
  }
  addGroupDetails() {
    const saleDetails = new SaleDetails();
    saleDetails.label = '';

    saleDetails.editable = true;
    saleDetails.actionStore = true;
    saleDetails.index = this.indexSaleDetails++;
    if (this.listDetails == null) {
      this.listDetails = new Array();
    }
    this.listDetails.unshift(saleDetails);
  }

  confirmStoreSaleDetails(rowSaleDetails: SaleDetails) {
    if (this.isSale) {
      const sale = new Sale().buildSaleWithId(this.currentSale.id);
      rowSaleDetails.sale = sale;
    } else {
      const parentSaleDetail = new SaleDetails();
      parentSaleDetail.id = this.parentId;
      rowSaleDetails.parent = parentSaleDetail;
    }

    let saleObs: Observable<SaleDetails>;
    saleObs = this.saleDetailsService.addSaleDetails(rowSaleDetails);
    saleObs.subscribe(restData => {
      rowSaleDetails.editable = false;
      rowSaleDetails.actionStore = false;
    }, errRes => {
      console.log(errRes);
    });
  }

  public ignoreStoreGroupDetails(rowSaleDetails: SaleDetails) {
    this.deleteSaleDetailsBy(rowSaleDetails.index);
    rowSaleDetails.actionStore = false;
  }

  public deleteSaleDetailsBy(index: number) {
    for (let _i = 0; _i < this.listDetails.length; _i++) {
      if (this.listDetails[_i].index === index) {
        this.listDetails.splice(_i, 1);
      }
    }
  }
  goNext() {
    this.router.navigate(['/administrator/market/sale-recap'], { queryParams: { saleId: this.fetchSaleId } });
  }
  goBack() {
    this.router.navigate(['/administrator/market/sale-details'], { queryParams: { saleId: this.fetchSaleId } });
  }
}
