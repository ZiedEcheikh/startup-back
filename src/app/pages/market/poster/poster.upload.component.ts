import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { SalePosterService, SaleService } from '../_service';

import { SalePosterData } from '../_models';
import { take, switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sale',
  templateUrl: './poster.upload.component.html',
  styleUrls: ['./poster.upload.component.scss'],
})
export class PosterUploadComponent implements OnInit {
  items: MenuItem[];
  images: any[];
  saleLabel: string;
  uploadedFile: any;
  isHavePoster = false;

  uploadedFiles: any[] = [];
  constructor(private saleService: SaleService, private salePosterService: SalePosterService,
    private route: ActivatedRoute) {
    this.items = [
      { label: 'Vente' },
      { label: 'Affiche' },
      { label: 'Détails' },
      { label: 'Récap' },
    ];
  }

  ngOnInit() {
    this.initialize().subscribe(poster => {
      console.log(poster);
    },
      error => { console.log(error); }
    );
  }

  initialize() {
    let fetchSaleId: string;
    return this.route.queryParams.pipe(
      take(1),
      switchMap(params => {
        fetchSaleId = params.saleId;
        return this.saleService.getSale(fetchSaleId);
      }),
      take(1),
      switchMap(saleCreated => {
        if (saleCreated) {
          this.saleLabel = saleCreated.label;
          return this.salePosterService.getPosterOfSale(fetchSaleId);
        }
      }),
      take(1),
      tap(salePoster => {
        if (salePoster) {
          this.isHavePoster = true;
          const file = {name: salePoster.pictureName,
             path : 'http://192.168.80.128/images' + salePoster.picturePath + "sale202004301117.png"};
          this.uploadedFiles.push(file);
        }
      }),
    );
  }

  uploadPoster(event: any) {
    for (const file of event.files) {
      this.salePosterService.uploadPosterSale(file, '1');
    }
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
  /**uploadHandler(event) {
    this.uploadedFile = event.file;
    let uploadObs: Observable<SalePosterData>;
    uploadObs = this.salePosterService.uploadPosterSale(event.files[0], '1');

    uploadObs.subscribe(restData => {
      console.log(restData);
    }, errRes => {
      console.log(errRes);
    });
  }**/

  onUploadHandler(event, form) {
    form.clear();
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
  onFileSelect(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
}
