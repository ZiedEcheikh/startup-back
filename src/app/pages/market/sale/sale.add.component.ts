import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { StepService } from '../_service/StepService';

import { Category } from '../_models';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.add.component.html',
  styleUrls: ['./sale.add.component.scss']
})
export class SaleAddComponent implements OnInit {
  categories: Category[];
  selectedCetegory: Category;
  saleStat: boolean;
  constructor(private stepService: StepService) {
    this.categories = [
      { name: 'Selectionné une catégorie', code: null },
      { name: 'Mode', code: 'NY' },
      { name: 'Maison', code: 'RM' },
      { name: 'Enfant', code: 'LDN' },
      { name: 'Sport', code: 'IST' },
      { name: 'Voyage', code: 'PRS' }
    ];
  }

  ngOnInit() {
    this.stepService.changeStep(0);
  }

  nextStep() {

  }
}
