import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { SalePosterService, SaleService } from '../_service';

import { Sale, SalePosterData } from '../_models';
import { take, switchMap, map, tap } from 'rxjs/operators';

import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';

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
  currentSale: Sale;
  uploadedFiles: any[] = [];
  fetchSaleId: string;
  display = false;
  constructor(private saleService: SaleService, private salePosterService: SalePosterService,
    private route: ActivatedRoute, private loadingPageService: LoadingPageService) {
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

    return this.route.queryParams.pipe(
      take(1),
      switchMap(params => {
        this.fetchSaleId = params.saleId;
        return this.saleService.getSale(this.fetchSaleId);
      }),
      take(1),
      switchMap(saleCreated => {
        if (saleCreated) {
          this.saleLabel = saleCreated.label;
          this.currentSale = saleCreated;
          return this.salePosterService.getPosterOfSale(this.fetchSaleId);
        }
      }),
      take(1),
      tap(salePoster => {
        if (salePoster) {
          this.isHavePoster = true;
          const file = {
            name: salePoster.pictureName,
            path: 'http://192.168.80.128/images' + salePoster.picturePath + salePoster.pictureName
          };
          this.uploadedFiles.push(file);
        }
      }),
    );
  }

  deletePosterOfSale(saleId: string) {
    return this.salePosterService.deletePosterOfSale(saleId).pipe(
      take(1),
      switchMap(deletedPoster => {
        if (deletedPoster) {
          return this.salePosterService.getPosterOfSale(saleId);
        }
      }),
      take(1),
      tap(poster => { console.log('poster not deleted'); },
        error => { this.isHavePoster = false; this.uploadedFiles = []; }
      ));
  }

  onUploadHandler(event, form) {
    this.loadingPageService.present();
    form.clear();
    let uploadObs: Observable<SalePosterData>;
    uploadObs = this.salePosterService.uploadPosterSale(event.files[0], this.currentSale.id.toString());
    uploadObs.subscribe(restData => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
      this.isHavePoster = true;
      this.uploadedFiles = [];
      const file = { name: restData.pictureName, path: "http://192.168.80.128/images/" + restData.picturePath + restData.pictureName };
      this.uploadedFiles.push(file);
    }, errRes => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    });
  }

  onDeletePosterOfSale() {
    this.display = false;
    this.loadingPageService.present();
    let deleteObs: Observable<SalePosterData>;
    deleteObs = this.deletePosterOfSale(this.fetchSaleId);
    deleteObs.subscribe(deletedPoster => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    }, err => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    });
  }

  confirmDeletePoster() {
    this.display = true;
  }
  onDeleteLocalPoster() {
    this.uploadedFiles = [];
  }
  onFileSelect(event) {
    this.uploadedFiles = [];
    this.isHavePoster = false;
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
}
