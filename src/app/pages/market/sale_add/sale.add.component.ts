import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

import { MenuItem } from 'primeng/api';

import {
  SaleService,
  SaleCategoriesService,
  MarketMenuService,
} from '../_service';

import { Sale, SaleCategory, SaleSubCategory } from '../_models';

import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.add.component.html',
  styleUrls: ['./sale.add.component.scss'],
})
export class SaleAddComponent implements OnInit {
  itemsStepsMenu: MenuItem[];
  categories: SaleCategory[] =  new Array();
  selectedCetegory: SaleCategory;
  selectedSubCetegory: SaleSubCategory;
  saleStat = false;
  label: string;
  beginDate: Date;
  endDate: Date;
  fetchSaleId: string;
  currentDateTime: Date;
  description: string;

  constructor(
    private saleService: SaleService,
    private saleCategoriesService: SaleCategoriesService,
    private marketMenuService: MarketMenuService,
    private loadingPageService: LoadingPageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadingPageService.present();
    this.currentDateTime = new Date();
    this.retrieveCategories();
    this.initializeData().subscribe(
      (saleCreated) => {
        this.fetchSaleId = saleCreated.id.toString();
        this.label = saleCreated.label;
        this.saleStat = saleCreated.enable;
        this.beginDate = new Date(saleCreated.beginDate);
        this.endDate = new Date(saleCreated.endDate);
        this.selectedCetegory = saleCreated.category;
        this.selectedSubCetegory = saleCreated.subCategory;
        this.description = saleCreated.description;
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
      },
      (errors) => {
        this.fetchSaleId = null;
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
      }
    );
  }

  initializeData() {
    this.itemsStepsMenu = this.marketMenuService.getItemsNewSaleSteps();
    return this.route.queryParams.pipe(
      take(1),
      switchMap((params) => {
        if (params.saleId) {
          return this.saleService.getSale(params.saleId);
        }
      })
    );
  }

  retrieveCategories() {
    let categoriesObs: Observable<SaleCategory[]>;
    categoriesObs = this.saleCategoriesService.getAllSaleCategories();
    categoriesObs.subscribe(
      (restData) => {
        this.categories = restData;
      },
      (errRes) => { }
    );
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const label = form.value.label;
    const saleStat = form.value.saleStat;
    const beginDate = form.value.beginDate;
    const endDate = form.value.endDate;
    const category = form.value.category;
    const descritption = form.value.descritption;
    const sale = new Sale().buildSale(
      label,
      descritption,
      beginDate,
      endDate,
      category,
      saleStat,
      true,
      this.selectedSubCetegory
    );
    if (this.fetchSaleId == null) {
      this.saveSale(sale);
    } else {
      sale.id = Number(this.fetchSaleId);
      this.updateSale(sale);
    }
  }

  saveSale(sale: Sale) {
    let saleObs: Observable<Sale>;
    saleObs = this.saleService.addSale(sale);
    saleObs.subscribe(
      (restData) => {
        this.goPosterPage(restData.id);
      },
      (errRes) => { }
    );
  }

  updateSale(sale: Sale) {
    let saleObs: Observable<Sale>;
    saleObs = this.saleService.updateSale(sale);
    saleObs.subscribe(
      (restData) => {
        this.goPosterPage(restData.id);
      },
      (errRes) => {
      }
    );
  }

  changeSubCategories(event: any) {
    this.selectedSubCetegory = null;
  }

  goPosterPage(saleId: number) {
    this.router.navigate(['/administrator/market/poster-upload'], {
      queryParams: { saleId },
    });
  }
}
