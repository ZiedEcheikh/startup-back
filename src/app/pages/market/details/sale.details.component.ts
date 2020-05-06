import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, switchMap, tap } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { SaleService, SaleDetailsService } from '../_service';
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
    private route: ActivatedRoute, private loadingPageService: LoadingPageService) {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];

    this.menus = [
      {
        label: 'File',
        items: [{
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: 'Project' },
            {
              label: 'Other', command: (event: Event) => { this.router.navigateByUrl('administrator/market/sale-manage/' + this.selectedDetail.id); }
            },
          ]
        },
        { label: 'Open' },
        { label: 'Quit' }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-plus',
        items: [
          { label: 'Delete', icon: 'pi pi-fw pi-trash' },
          { label: 'Refresh', icon: 'pi pi-fw pi-refresh' }
        ]
      }
    ];
  }

  ngOnInit() {

    this.initialize().subscribe(saleDetails => {
      console.log(saleDetails);
    },
      errors => {
        if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
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
          return this.saleService.getSale(this.fetchSaleId);
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
    if (false) {
      console.log('selectrf');
    }
  }
}
