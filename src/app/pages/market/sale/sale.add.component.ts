import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { Category } from '../_models';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.add.component.html',
  styleUrls: ['./sale.add.component.scss']
})
export class SaleAddComponent implements OnInit {
  items: MenuItem[];
  categories: Category[];
  selectedCetegory: Category;
  saleStat: boolean;
  constructor() {

    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];
    this.categories = [
      { name: 'Selectionné une catégorie *', code: null },
      { name: 'Mode', code: 'NY' },
      { name: 'Maison', code: 'RM' },
      { name: 'Enfant', code: 'LDN' },
      { name: 'Sport', code: 'IST' },
      { name: 'Voyage', code: 'PRS' }
    ];
  }

  ngOnInit() {
  }

  nextStep() {

  }
}
