import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, switchMap, tap } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { SaleService, SaleDetailsService, MenuService } from '../_service';
import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';
import { NodeTreeSaleDetails, Sale } from '../_models';
import { ErrorCode } from 'src/app/common';


@Component({
  selector: 'app-sale',
  templateUrl: './sale.details.component.html',
  styleUrls: ['./sale.details.component.scss']
})

export class SaleDetailsComponent implements OnInit {
  items: MenuItem[];
  menus: MenuItem[];
  currentSale: Sale;
  treeSaleDetails: NodeTreeSaleDetails[];
  selectedDetail: NodeTreeSaleDetails;
  fetchSaleId: string;
  constructor(private saleService: SaleService, private saleDetailsService: SaleDetailsService, private router: Router,
    private route: ActivatedRoute, private menuService: MenuService, private loadingPageService: LoadingPageService) {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];
  }

  ngOnInit() {
    this.loadingPageService.present();
    this.initialize().subscribe(saleDetails => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    },
      errors => {
        if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
          setTimeout(() => this.loadingPageService.dismiss(), 2000);
          this.router.navigate(['/administrator/market/sale-add']);
        }
      }
    );
  }

  initialize() {
    return this.route.queryParams.pipe(
      take(1),
      switchMap(params => {
        this.fetchSaleId = params.saleId;
        if (this.fetchSaleId) {
          return this.saleService.getSale(Number(this.fetchSaleId));
        } else {
          this.router.navigate(['/administrator/market/sale-add']);
          return;
        }
      }),
      take(1),
      switchMap(saleCreated => {
        if (saleCreated) {
          this.currentSale = saleCreated;
          return this.saleDetailsService.getSaleDetailsBySaleId(saleCreated.id);
        }
      }),
      take(1),
      tap(saleDetails => {
        this.treeSaleDetails = this.saleDetailsService.generateTreeForSale(this.currentSale, saleDetails);
      }),
    );
  }
  nodeSelect(event: any) {
    console.log('node slected');
    // this.router.navigateByUrl('administrator/market/sale-manage/' + this.selectedDetail.id);
  }
  contextMenu(event: any) {
  this.menus = this.menuService.getItemTreeMenu(event, Number(this.fetchSaleId));
  }

  goNext() {
    this.router.navigate(['/administrator/market/sale-recap'], { queryParams: { saleId: this.fetchSaleId }});
  }
  goBack() {
    this.router.navigate(['/administrator/market/poster-upload'], { queryParams: { saleId: this.fetchSaleId }});
  }
}
