import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { MenuItem } from 'primeng/api';

import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';

import { ErrorCode } from '../../../common';

import {
  SaleService,
  SaleDetailsService,
  SaleProductService,
  MarketMenuService,
} from '../_service';

import { Sale, NodeTreeSaleDetails } from '../_models';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale.details.component.html',
  styleUrls: ['./sale.details.component.scss'],
})
export class SaleDetailsComponent implements OnInit {
  itemsStepsMenu: MenuItem[];
  menusTreeSaleDetails: MenuItem[];
  currentSale: Sale;
  treeSaleDetails: NodeTreeSaleDetails[];
  selectedDetail: NodeTreeSaleDetails;
  fetchSaleId: number;
  constructor(
    private saleService: SaleService,
    private saleDetailsService: SaleDetailsService,
    private saleProductService: SaleProductService,
    private marketMenuService: MarketMenuService,
    private loadingPageService: LoadingPageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadingPageService.present();
    this.initialize().subscribe(
      (saleDetails) => {
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
      },
      (errors) => {
        if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
          this.router.navigate(['/administrator/market/sale-add']);
        }
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
      }
    );
  }

  initialize() {
    this.itemsStepsMenu = this.marketMenuService.getItemsNewSaleSteps();
    return this.route.queryParams.pipe(
      take(1),
      switchMap((params) => {
        this.fetchSaleId = params.saleId;
        if (this.fetchSaleId) {
          return this.saleService.getSale(this.fetchSaleId);
        } else {
          this.router.navigate(['/administrator/market/sale-add']);
          return of(null);
        }
      }),
      take(1),
      switchMap((saleCreated) => {
        if (saleCreated) {
          this.currentSale = saleCreated;
          return this.saleDetailsService.getSaleDetailsBySaleId(saleCreated.id);
        }
      }),
      take(1),
      switchMap((groupsDetails) => {
        this.treeSaleDetails = this.saleDetailsService.generateTreeForSale(
          this.currentSale,
          []
        );
        if (groupsDetails.length > 0) {
          this.treeSaleDetails = this.saleDetailsService.generateTreeForSale(
            this.currentSale,
            groupsDetails
          );
          return of(null);
        }
        return this.saleProductService.getProductsOfSale(this.fetchSaleId);
      }),
      take(1),
      tap((productsDetails) => {
        if (productsDetails != null && productsDetails.length > 0) {
          this.treeSaleDetails = this.saleDetailsService.generateTreeForSaleWithOnlyProducts(
            this.currentSale,
            productsDetails
          );
        }
      })
    );
  }

  onNodeSelect(event: any) {
    this.menusTreeSaleDetails = this.marketMenuService.getItemsTreeSaleDetailsMenu(
      event,
      this.fetchSaleId
    );
  }

  goSaleRecap() {
    this.router.navigate(['/administrator/market/sale-recap'], {
      queryParams: { saleId: this.fetchSaleId },
    });
  }

  goSalePoster() {
    this.router.navigate(['/administrator/market/poster-upload'], {
      queryParams: { saleId: this.fetchSaleId },
    });
  }
}
