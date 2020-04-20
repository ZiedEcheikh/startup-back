import { Component, OnInit} from '@angular/core';
import { StepService } from '../_service/StepService';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.details.component.html',
  styleUrls: ['./sale.details.component.scss']
})
export class SaleDetailsComponent implements OnInit {

  constructor(private stepService: StepService) {

  }

  ngOnInit() {
    this.stepService.changeStep(2);
  }


}
