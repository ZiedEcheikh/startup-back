import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { SaleDetails } from '../_models/SaleDetails';
import {SaleDetailsService} from '../_service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.details.manage.component.html',
  styleUrls: ['./sale.details.manage.component.scss']
})

export class SaleDetailsManageComponent implements OnInit {
  selectedType: string;
  uploadedFiles: any[] = [];
  items: MenuItem[];
  currentDetails: SaleDetails[];
  selectedDetails: SaleDetails;
  cols: any[];
  constructor(private saleDetailsService: SaleDetailsService) {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];

    this.currentDetails = saleDetailsService.getSaleDetailsOfParent('1');

    this.cols = [
      { field: 'label', header: 'Labelle' },
      { field: 'description', header: 'Description' }
  ];
  }

  ngOnInit() {
    this.selectedType = null;
  }
}
