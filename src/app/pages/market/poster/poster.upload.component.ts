import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sale',
  templateUrl: './poster.upload.component.html',
  styleUrls: ['./poster.upload.component.scss']
})
export class PosterUploadComponent implements OnInit {
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
