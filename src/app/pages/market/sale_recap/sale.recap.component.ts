import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, switchMap, tap } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import {
  MarketMenuService,
  SaleService,
  SalePosterService,
  SaleDetailsService,
} from '../_service';
import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';
import { RestConfig } from '../../../common/services/rest/rest.config';
import { Sale, SalePosterData, NodeTreeSaleDetails } from '../_models';
@Component({
  selector: 'app-sale-recap',
  templateUrl: './sale.recap.component.html',
  styleUrls: ['./sale.recap.component.scss'],
})
export class SaleRecapComponent implements OnInit {
  itemsMenu: MenuItem[];
  fetchSaleId: number;
  currentSale: Sale;
  poster: SalePosterData;
  treeSaleDetails: NodeTreeSaleDetails[];
  constructor(
    private saleService: SaleService,
    private saleDetailsService: SaleDetailsService,
    private salePosterService: SalePosterService,
    private loadingPageService: LoadingPageService,
    private marketMenuService: MarketMenuService,
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
      }
    );
  }

  initialize() {
    this.itemsMenu = this.marketMenuService.getItemsNewSaleSteps();
    return this.route.queryParams.pipe(
      take(1),
      switchMap((params) => {
        this.fetchSaleId = params.saleId;
        return this.saleService.getSale(this.fetchSaleId);
      }),
      take(1),
      switchMap((sale) => {
        this.currentSale = sale;
        return this.salePosterService.getPosterOfSale(this.fetchSaleId);
      }),
      take(1),
      switchMap((poster) => {
        poster.source =
          RestConfig.FILES_HOST + poster.picturePath + poster.pictureName;
        this.poster = poster;
        return this.saleDetailsService.getSaleDetailsBySaleId(this.fetchSaleId);
      }),
      take(1),
      tap((saleDetails) => {
        this.treeSaleDetails = this.saleDetailsService.generateTreeForSale(
          this.currentSale,
          saleDetails
        );
      })
    );
  }

  goSaleDetails() {
    this.router.navigate(['/administrator/market/sale-details'], {
      queryParams: { saleId: this.fetchSaleId },
    });
  }
  validateSale() {
  }
}