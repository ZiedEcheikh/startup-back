import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { NodeTreeSaleDetails } from '../_models';
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
  currentDetails: NodeTreeSaleDetails[];
  selectedDetails: NodeTreeSaleDetails;
  cols: any[];
  constructor(private saleDetailsService: SaleDetailsService) {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];

    this.cols = [
      { field: 'label', header: 'Labelle' },
      { field: 'description', header: 'Description' }
  ];
  }

  ngOnInit() {
    this.selectedType = null;
  }
}
