import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketComponent } from './market.component';

import { SaleAddComponent } from './sale_add/sale.add.component';
import { SalePosterComponent } from './sale_poster/sale.poster.component';
import { SaleRecapComponent } from './sale_recap/sale.recap.component';
import { SaleDetailsComponent } from './sale_details/sale.details.component';
import { SaleDetailsGroupsManageComponent } from './sale_details/groups_manage/sale.details.groups.manage.component';
import { SaleDetailsProductsManageComponent } from './sale_details/products_manage/sale.details.products.manage.component';
import { ProductCriteriaComponent } from './sale_details/products_manage/product_criterion/product.criteria.component';
import { ProductPicturesComponent } from './sale_details/products_manage/product_pictures/product.pictures.component';
import { SaleConsultComponent } from './sale_consult/sale.consult.component';

const routes: Routes = [
  {
    path: '',
    component: MarketComponent,
    children: [
      { path: 'sales-consult', component: SaleConsultComponent },
      { path: 'sale-add', component: SaleAddComponent },
      { path: 'poster-upload', component: SalePosterComponent },
      { path: 'sale-details', component: SaleDetailsComponent },
      { path: 'sale-recap', component: SaleRecapComponent },
      { path: 'sale-details-manage', component: SaleDetailsGroupsManageComponent },
      { path: 'sale-products-manage', component: SaleDetailsProductsManageComponent },
      { path: 'criterion', component: ProductCriteriaComponent },
      { path: 'pictures', component: ProductPicturesComponent },
      { path: '', redirectTo: 'sale', pathMatch: 'full' },
      { path: '**', redirectTo: 'sale', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketRoutingModule { }
