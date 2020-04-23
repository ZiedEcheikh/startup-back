import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../common/tools/material.module';

import { MarketRoutingModule } from './market.routing.module';

import { MarketComponent } from './market.component';
import { SaleAddComponent } from './sale/sale.add.component';
import { PosterUploadComponent } from './poster/poster.upload.component';
import { SaleDetailsComponent } from './details/sale.details.component';
import { SaleRecapComponent } from './recap/sale.recap.component';
import { SaleDetailsManageComponent } from './details_manage/sale.details.manage.component';
import { SaleProductsManageComponent } from './products_manage/sale.products.manage.component';

/*Services*/
import { SaleService, SaleDetailsService, SaleProductService } from './_service';

@NgModule({
  declarations: [MarketComponent, SaleAddComponent, PosterUploadComponent,
    SaleDetailsComponent, SaleRecapComponent,
    SaleDetailsManageComponent, SaleProductsManageComponent],
  imports: [
    CommonModule,
    FormsModule,
    MarketRoutingModule,
    MaterialModule
  ],
  providers: [
    SaleService,
    SaleDetailsService,
    SaleProductService
  ]
})
export class MarketModule { }
