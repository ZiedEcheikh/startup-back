import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { StepService } from '../_service/StepService';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.recap.component.html',
  styleUrls: ['./sale.recap.component.scss']
})
export class SaleRecapComponent implements OnInit {

  constructor(private stepService: StepService) {

  }

  ngOnInit() {
    this.stepService.changeStep(3);
  }

}
