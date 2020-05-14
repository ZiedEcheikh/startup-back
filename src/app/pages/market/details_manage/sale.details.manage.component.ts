import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { SaleDetailsService, MenuService, SaleService } from '../_service';
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
  constructor(private saleService: SaleService, private saleDetailsService: SaleDetailsService, private menuService: MenuService,
    private route: ActivatedRoute, private router: Router, private loadingPageService: LoadingPageService) {
    this.stepsItems = this.menuService.getItemsNewSaleSteps();

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

  goCreateDetails() {
    this.router.navigate(['/administrator/market/create-update-sale-details'],
      { queryParams: { saleId: this.fetchSaleId, parentId: this.parentId, nodeOfSale: this.isSale } });
  }

  goUpdateDetails(saleDetails: SaleDetails) {
    this.router.navigate(['/administrator/market/create-update-sale-details'],
      { queryParams: { saleId: this.fetchSaleId, parentId: this.parentId, detailsId: saleDetails.id, nodeOfSale: this.isSale } });
  }
  goNext() {
    this.router.navigate(['/administrator/market/sale-recap'], { queryParams: { saleId: this.fetchSaleId } });
  }
  goBack() {
    this.router.navigate(['/administrator/market/sale-details'], { queryParams: { saleId: this.fetchSaleId } });
  }
}
