import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketComponent } from './market.component';

import { SaleAddComponent } from './sale/sale.add.component';
import { PosterUploadComponent } from './poster/poster.upload.component';
import { SaleRecapComponent } from './recap/sale.recap.component';
import { SaleDetailsComponent } from './details/sale.details.component';
import { SaleDetailsManageComponent } from './details_manage/sale.details.manage.component';
import { SaleProductsManageComponent } from './products_manage/sale.products.manage.component';
const routes: Routes = [

  {
    path: '',
    component: MarketComponent,
    children: [
      { path: 'sale-add', component: SaleAddComponent },
      { path: 'poster-upload', component: PosterUploadComponent },
      { path: 'sale-details', component: SaleDetailsComponent },
      { path: 'sale-recap', component: SaleRecapComponent },
      { path: 'sale-details-manage/:idParent', component: SaleDetailsManageComponent},
      { path: 'sale-products-manage/:idParent', component: SaleProductsManageComponent},
      { path: '', redirectTo: 'sale', pathMatch: 'full' },
      { path: '**', redirectTo: 'sale', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
