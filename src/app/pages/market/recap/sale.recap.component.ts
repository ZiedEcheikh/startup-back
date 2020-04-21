import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { StepService } from '../_service/StepService';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.recap.component.html',
  styleUrls: ['./sale.recap.component.scss']
})
export class SaleRecapComponent implements OnInit {
  items: MenuItem[];
  constructor(private stepService: StepService) {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];
  }

  ngOnInit() {
    this.stepService.changeStep(3);
  }

}
