import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, from, pipe } from 'rxjs';
import { take, switchMap, concatMap, tap } from 'rxjs/operators';

import { SaleService, SalePosterService } from '../_service';
import { Sale, SalePosterData } from '../_models';
import { RestConfig } from 'src/app/common/services/rest/rest.config';

@Component({
  selector: 'app-sale-recap',
  templateUrl: './sale.consult.component.html',
  styleUrls: ['./sale.consult.component.scss'],
})
export class SaleConsultComponent implements OnInit {
  loadingInProgress = false;
  loadingComeUp = false;
  loadingOver = false;
  loadingDisable = false;
  loadingDraft = false;

  salesInProgress: Sale[];
  salesCommeUp: Sale[];
  salesOver: Sale[];
  salesDisable: Sale[];
  salesDraft: Sale[];

  colsSales: any[];

  constructor(
    private saleService: SaleService,
    private salePosterService: SalePosterService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  private initialize() {
    this.generateColsSales();
  }

  private generateColsSales() {
    this.colsSales = [
      { field: 'label', header: 'Labelle' },
      { field: 'description', header: 'Description' },
      { field: 'beginDate', header: 'Date début' },
      { field: 'endDate', header: 'Date Fin' },
    ];
  }

  onSalesInProgress(event) {
    if (event.collapsed === true) {
      this.loadingInProgress = true;
      let salesObs: Observable<any>;
      salesObs = this.saleService.getSalesInProgress().pipe(
        take(1),
        switchMap((sales) => {
          this.salesInProgress = sales;
          return from(this.salesInProgress).pipe(
            concatMap((saleInProgress) =>
              this.salePosterService.getPosterOfSale(saleInProgress.id)
            )
          );
        }),
        pipe(),
        tap((poster) => {
          this.addPosterToSale(poster, this.salesInProgress);
        })
      );
      salesObs.subscribe(
        (sales) => { },
        (errRes) => { },
        () => {
          this.loadingInProgress = false;
        }
      );
    }
  }

  onSalesComeUp(event) {
    if (event.collapsed === true) {
      this.loadingComeUp = true;
      let salesObs: Observable<any>;
      salesObs = this.saleService.getSalesComeUp().pipe(
        take(1),
        switchMap((sales) => {
          this.salesCommeUp = sales;
          return from(this.salesCommeUp).pipe(
            concatMap((saleCommeUp) =>
              this.salePosterService.getPosterOfSale(saleCommeUp.id)
            )
          );
        }),
        pipe(),
        tap((poster) => {
          this.addPosterToSale(poster, this.salesCommeUp);
        })
      );
      salesObs.subscribe(
        (sales) => { },
        (errRes) => { },
        () => {
          this.loadingComeUp = false;
        }
      );
    }
  }

  onSalesOver(event) {
    if (event.collapsed === true) {
      this.loadingOver = true;
      let salesObs: Observable<any>;
      salesObs = this.saleService.getSalesOver().pipe(
        take(1),
        switchMap((sales) => {
          this.salesOver = sales;
          return from(this.salesOver).pipe(
            concatMap((saleOver) =>
              this.salePosterService.getPosterOfSale(saleOver.id)
            )
          );
        }),
        pipe(),
        tap((poster) => {
          this.addPosterToSale(poster, this.salesOver);
        })
      );
      salesObs.subscribe(
        (sales) => { },
        (errRes) => { },
        () => {
          this.loadingOver = false;
        }
      );
    }
  }

  onSalesDisable(event) {
    if (event.collapsed === true) {
      this.loadingDisable = true;
      let salesObs: Observable<any>;
      salesObs = this.saleService.getSalesDisable().pipe(
        take(1),
        switchMap((sales) => {
          this.salesDisable = sales;
          return from(this.salesDisable).pipe(
            concatMap((saleDisable) =>
              this.salePosterService.getPosterOfSale(saleDisable.id)
            )
          );
        }),
        pipe(),
        tap((poster) => {
          this.addPosterToSale(poster, this.salesDisable);
        })
      );
      salesObs.subscribe(
        (sales) => { },
        (errRes) => { },
        () => {
          this.loadingDisable = false;
        }
      );
    }
  }

  onSalesDraft(event) {
    if (event.collapsed === true) {
      this.loadingDraft = true;
      let salesObs: Observable<any>;
      salesObs = this.saleService.getSalesDraft().pipe(
        take(1),
        switchMap((sales) => {
          this.salesDraft = sales;
          return from(this.salesDraft).pipe(
            concatMap((saleDraft) =>
              this.salePosterService.getPosterOfSale(saleDraft.id)
            )
          );
        }),
        pipe(),
        tap((poster) => {
          this.addPosterToSale(poster, this.salesDraft);
        })
      );
      salesObs.subscribe(
        (sales) => { },
        (errRes) => { },
        () => {
          this.loadingDraft = false;
        }
      );
    }
  }

  private addPosterToSale(poster: SalePosterData, sales: Sale[]) {
    for (const sale of sales) {
      if (sale.id === poster.saleId) {
        poster.source = RestConfig.FILES_HOST +
          poster.picturePath +
          poster.pictureName;
        sale.poster = poster;
      }
    }
  }

  goSale(sale: Sale) {
    this.router.navigate(['/administrator/market/sale-add'], {
      queryParams: { saleId: sale.id },
    });
  }
}
