import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../common/tools/material.module';

import { MarketRoutingModule } from './market.routing.module';

import { MarketComponent } from './market.component';
import { SaleConsultComponent } from './sale_consult/sale.consult.component';
import { SaleAddComponent } from './sale_add/sale.add.component';
import { SalePosterComponent } from './sale_poster/sale.poster.component';
import { SaleDetailsComponent } from './sale_details/sale.details.component';
import { SaleRecapComponent } from './sale_recap/sale.recap.component';
import { SaleDetailsGroupsManageComponent } from './sale_details/groups_manage/sale.details.groups.manage.component';
import { SaleDetailsProductsManageComponent } from './sale_details/products_manage/sale.details.products.manage.component';
import { ProductCriteriaComponent } from './sale_details/products_manage/product_criterion/product.criteria.component';
import { ProductPicturesComponent } from './sale_details/products_manage/product_pictures/product.pictures.component';
import { CustomDatePipe } from '../../common/pipes/custom.date.pipe';
import { PanelLoadingComponent } from '../../theme/loading/panel/panel.loading.component';
/*Services*/
import {
  SaleService,
  SaleDetailsService,
  SaleProductService,
  SalePosterService,
  ProductCriteriaService,
  ProductPictureService,
  MarketMenuService,
} from './_service';

@NgModule({
  declarations: [
    MarketComponent,
    SaleConsultComponent,
    SaleAddComponent,
    SalePosterComponent,
    SaleDetailsComponent,
    SaleRecapComponent,
    SaleDetailsGroupsManageComponent,
    SaleDetailsProductsManageComponent,
    ProductCriteriaComponent,
    ProductPicturesComponent,
    CustomDatePipe,
    PanelLoadingComponent
  ],
  imports: [CommonModule, FormsModule, MarketRoutingModule, MaterialModule],
  providers: [
    SaleService,
    SaleDetailsService,
    SaleProductService,
    SalePosterService,
    ProductCriteriaService,
    ProductPictureService,
    MarketMenuService,
  ],
})
export class MarketModule { }
