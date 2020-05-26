import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { RestConfig } from '../../../common/services/rest/rest.config';

import { ErrorCode } from '../../../common';

import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';
import { SalePosterService, SaleService, MarketMenuService } from '../_service';

import { Sale, SalePosterData } from '../_models';

@Component({
  selector: 'app-sale-poster',
  templateUrl: './sale.poster.component.html',
  styleUrls: ['./sale.poster.component.scss'],
})
export class SalePosterComponent implements OnInit {
  itemsStepsMenu: MenuItem[];
  saleLabel: string;
  isHavePoster = false;
  currentSale: Sale;
  uploadedFiles: any[] = [];
  fetchSaleId: number;
  display = false;
  constructor(
    private saleService: SaleService,
    private salePosterService: SalePosterService,
    private marketMenuService: MarketMenuService,
    private loadingPageService: LoadingPageService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadingPageService.present();
    this.initialize().subscribe(
      (poster) => {
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
      },
      (errors) => {
        if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
          this.router.navigate(['/administrator/market/sale-add']);
        }
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
      }
    );
  }

  initialize() {
    this.itemsStepsMenu = this.marketMenuService.getItemsNewSaleSteps();
    return this.route.queryParams.pipe(
      take(1),
      switchMap((params) => {
        this.fetchSaleId = params.saleId;
        if (this.fetchSaleId) {
          return this.saleService.getSale(this.fetchSaleId);
        } else {
          this.router.navigate(['/administrator/market/sale-add']);
          return;
        }
      }),
      take(1),
      switchMap((saleCreated) => {
        if (saleCreated) {
          this.saleLabel = saleCreated.label;
          this.currentSale = saleCreated;
          return this.salePosterService.getPosterOfSale(this.fetchSaleId);
        }
      }),
      take(1),
      tap((salePoster) => {
        if (salePoster) {
          this.isHavePoster = true;
          const file = {
            name: salePoster.pictureName,
            path:
              RestConfig.FILES_HOST +
              salePoster.picturePath +
              salePoster.pictureName,
          };
          this.uploadedFiles.push(file);
        }
      })
    );
  }

  deletePosterOfSale(saleId: number) {
    return this.salePosterService.deletePosterOfSale(saleId).pipe(
      take(1),
      switchMap((deletedPoster) => {
        if (deletedPoster) {
          return this.salePosterService.getPosterOfSale(saleId);
        }
      }),
      take(1),
      tap(
        (poster) => {
          console.log('poster not deleted');
        },
        (error) => {
          this.isHavePoster = false;
          this.uploadedFiles = [];
        }
      )
    );
  }

  onUploadHandler(event, form) {
    let uploadObs: Observable<SalePosterData>;
    uploadObs = this.salePosterService.uploadPosterSale(
      event.files[0],
      this.currentSale.id.toString()
    );
    uploadObs.subscribe(
      (restData) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Service documents',
          detail: 'Affiche téléchargée avec succès',
          life: 6000
        });
        this.isHavePoster = true;
        this.uploadedFiles = [];
        const file = {
          name: restData.pictureName,
          path:
            RestConfig.FILES_HOST + restData.picturePath + restData.pictureName,
        };
        form.clear();
        this.uploadedFiles.push(file);
      },
      (errRes) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service documents',
          detail: 'Probléme de téléchargement de l\'affiche',
          life: 6000
        });
      }
    );
  }

  onDeletePosterOfSale() {
    this.display = false;
    let deleteObs: Observable<SalePosterData>;
    deleteObs = this.deletePosterOfSale(this.fetchSaleId);
    deleteObs.subscribe(
      (deletedPoster) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service documents',
          detail: 'Probléme de suppression de l\'affiche',
          life: 6000
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Service documents',
          detail: 'Affiche supprimer avec succès',
          life: 6000
        });
      }
    );
  }

  confirmDeletePoster() {
    this.display = true;
  }

  onDeleteLocalPoster() {
    this.uploadedFiles = [];
  }

  onPosterSelect(event) {
    this.uploadedFiles = [];
    this.isHavePoster = false;
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  goSaleDetails() {
    this.router.navigate(['/administrator/market/sale-details'], {
      queryParams: { saleId: this.fetchSaleId },
    });
  }

  goSaleAdd() {
    this.router.navigate(['/administrator/market/sale-add'], {
      queryParams: { saleId: this.fetchSaleId },
    });
  }
}
