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

import { StepService } from './_service';

@NgModule({
  declarations: [MarketComponent, SaleAddComponent, PosterUploadComponent,
    SaleDetailsComponent, SaleRecapComponent],
  imports: [
    CommonModule,
    FormsModule,
    MarketRoutingModule,
    MaterialModule
  ],
  providers: [
    StepService
  ]
})
export class MarketModule { }
