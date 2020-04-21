import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StepService } from './_service/StepService';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html'
})
export class MarketComponent {

  items: MenuItem[];
  subscription: Subscription;

  constructor() {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];

  }
}

