import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { take, switchMap, tap } from 'rxjs/operators';
import { SaleCategoriesService, SaleService } from '../_service';
import { SaleCategory, SaleSubCategory } from '../_models';
import { Sale } from '../_models/sale.model';

import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.add.component.html',
  styleUrls: ['./sale.add.component.scss']
})
export class SaleAddComponent implements OnInit {
  items: MenuItem[];
  categories: SaleCategory[];
  subCategories: SaleSubCategory[] = new Array();
  selectedCetegory: SaleCategory;
  selectedSubCetegory: SaleSubCategory;
  saleStat = false;
  label: string;
  beginDate: Date;
  endDate: Date;
  fetchSaleId: string;
  currentDateTime: Date;
  description: string;
  constructor(private saleCategoriesService: SaleCategoriesService,
              private route: ActivatedRoute,
              private router: Router,
              private saleService: SaleService,
              private loadingPageService: LoadingPageService) {

    this.currentDateTime = new Date();
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];
  }
  ngOnInit() {
    this.loadingPageService.present();
    this.retrieveCategories();
    this.initialize().subscribe(saleCreated => {
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
      errors => {
        console.log(errors);
        this.fetchSaleId = null;
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
      });
  }

  initialize() {
    return this.route.queryParams.pipe(
      take(1),
      switchMap(params => {
        if ( params.saleId) {
          return this.saleService.getSale(params.saleId);
        }
      })
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
    const subCategory = form.value.subCategory;
    const descritption = form.value.descritption;
    const sale = new Sale().buildSale(label, descritption, beginDate, endDate, category, saleStat, true, this.selectedSubCetegory);
    if (this.fetchSaleId == null) {
      this.saveSale(sale);
    } else {
      sale.id = Number(this.fetchSaleId);
      this.updateSale(sale);
    }

  }

  saveSale(sale: Sale) {
    this.loadingPageService.present();
    let saleObs: Observable<Sale>;
    saleObs = this.saleService.addSale(sale);
    saleObs.subscribe(restData => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
      this.router.navigate(['/administrator/market/poster-upload'], { queryParams: { saleId: restData.id } });
      console.log(restData);
    }, errRes => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
      console.log(errRes);
    });
  }
  updateSale(sale: Sale) {
    this.loadingPageService.present();
    let saleObs: Observable<Sale>;
    saleObs = this.saleService.updateSale(sale);
    saleObs.subscribe(restData => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
      this.router.navigate(['/administrator/market/poster-upload'], { queryParams: { saleId: restData.id } });
      console.log(restData);
    }, errRes => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
      console.log(errRes);
    });
  }
  retrieveCategories() {
    let categoriesObs: Observable<SaleCategory[]>;
    categoriesObs = this.saleCategoriesService.getAllSaleCategories();
    categoriesObs.subscribe(restData => {
      this.categories = restData;
      console.log(restData);
    }, errRes => {
      console.log(errRes);
    });
  }

  changeSubCategories(event: any) {
    this.selectedSubCetegory = null;
  }
}
