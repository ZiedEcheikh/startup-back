import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';


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

  currentDateTime: Date;
  constructor(private saleCategoriesService: SaleCategoriesService, private router: Router,
              private saleService: SaleService, private loadingPageService: LoadingPageService) {

    this.currentDateTime = new Date();
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];
  }
  ngOnInit() {
    this.retrieveCategories();
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
    const sale = new Sale(label, descritption, beginDate, endDate, category, saleStat, true, this.selectedSubCetegory);
    this.saveSale(sale);
  }

  saveSale(sale: Sale) {
    this.loadingPageService.present();
    let saleObs: Observable<Sale>;
    saleObs = this.saleService.addSale(sale);
    saleObs.subscribe(restData => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
      this.router.navigateByUrl('administrator/market/poster-upload');
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
