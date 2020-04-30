import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { SalePosterService } from '../_service/sale.poster.service';

import { SalePosterData } from '../_models';

@Component({
  selector: 'app-sale',
  templateUrl: './poster.upload.component.html',
  styleUrls: ['./poster.upload.component.scss'],
})
export class PosterUploadComponent implements OnInit {
  items: MenuItem[];
  uploadedFiles: any[] = [];
  constructor(private salePosterService: SalePosterService) {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' },
    ];
  }

  ngOnInit() { }

  uploadPoster(event: any) {
    for (const file of event.files) {
      this.salePosterService.uploadPosterSale(file, '1');
    }
  }
  onUpload(event) {
    let uploadObs: Observable<SalePosterData>;
    uploadObs = this.salePosterService.uploadPosterSale(event.files[0], '1');

    uploadObs.subscribe(restData => {
      console.log(restData);
    }, errRes => {
      console.log(errRes);
    });
  }
}
