import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { SaleProduct } from '../_models';
import { SaleProductService } from '../_service';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.products.manage.component.html',
  styleUrls: ['./sale.products.manage.component.scss']
})

export class SaleProductsManageComponent implements OnInit {

  types: SelectItem[];
  selectedType: string;
  uploadedFiles: any[] = [];
  items: MenuItem[];
  currentProducts: SaleProduct[];
  selectedProduct: SaleProduct;
  cols: any[];
  images: any[];

  constructor(private saleProductService: SaleProductService) {
    this.types = [];
    this.types.push({ label: 'Détails', value: 'details' });
    this.types.push({ label: 'Produits', value: 'produits' });
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' }
    ];

    this.cols = [
      { field: 'label', header: 'Labelle' },
      { field: 'description', header: 'Description' },
      { field: 'oldPrice', header: 'Ancien prix' },
      { field: 'newPrice', header: 'Nouveau prix' }
    ];

    this.currentProducts = this.saleProductService.getProductsOfDetails('1');

    this.images = [];
    this.images.push({
      source: 'assets/demo/images/sopranos/sopranos1.jpg',
      thumbnail: 'assets/demo/images/sopranos/sopranos1_small.jpg', title: 'Sopranos 1'
    });
    this.images.push({
      source: 'assets/demo/images/sopranos/sopranos2.jpg',
      thumbnail: 'assets/demo/images/sopranos/sopranos2_small.jpg', title: 'Sopranos 2'
    });
    this.images.push({
      source: 'assets/demo/images/sopranos/sopranos3.jpg',
      thumbnail: 'assets/demo/images/sopranos/sopranos3_small.jpg', title: 'Sopranos 3'
    });
    this.images.push({
      source: 'assets/demo/images/sopranos/sopranos4.jpg',
      thumbnail: 'assets/demo/images/sopranos/sopranos4_small.jpg', title: 'Sopranos 4'
    });
  }

  ngOnInit() {
    this.selectedType = null;
  }

  showProduct(event, overlaypanel: OverlayPanel) {
    overlaypanel.toggle(event);
  }
  
  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
}
