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
import { SaleDetailsCreateUpdateComponent } from './details_manage/create_update/sale.details.create.update.component';
import { SaleProductsManageComponent } from './products_manage/sale.products.manage.component';
import { ProductCriteriaComponent } from './products_manage/product_criterion/product.criteria.component';
import { ProductPicturesComponent } from './products_manage/product_pictures/product.pictures.component';

/*Services*/
import {
  SaleService, SaleDetailsService, SaleProductService,
  SalePosterService, ProductCriteriaService, ProductPictureService, MenuService
} from './_service';

@NgModule({
  declarations: [MarketComponent, SaleAddComponent, PosterUploadComponent,
    SaleDetailsComponent, SaleRecapComponent,
    SaleDetailsManageComponent, SaleDetailsCreateUpdateComponent, SaleProductsManageComponent,
    ProductCriteriaComponent, ProductPicturesComponent],
  imports: [
    CommonModule,
    FormsModule,
    MarketRoutingModule,
    MaterialModule
  ],
  providers: [
    SaleService,
    SaleDetailsService,
    SaleProductService,
    SalePosterService,
    ProductCriteriaService,
    ProductPictureService,
    MenuService
  ]
})
export class MarketModule { }
