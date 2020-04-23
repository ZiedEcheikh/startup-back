import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.recap.component.html',
  styleUrls: ['./sale.recap.component.scss']
})
export class SaleRecapComponent implements OnInit {
  items: MenuItem[];
  constructor() {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];
  }

  ngOnInit() {
  }

}
