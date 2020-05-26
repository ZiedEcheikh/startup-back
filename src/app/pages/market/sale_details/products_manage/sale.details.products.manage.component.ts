import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, from, pipe, of } from 'rxjs';
import { take, switchMap, tap, concatMap, mergeMap } from 'rxjs/operators';

import { MenuItem, MessageService } from 'primeng/api';

import { ErrorCode } from '../../../../common';
import { RestConfig } from '../../../../common/services/rest/rest.config';
import { LoadingPageService } from '../../../../theme/loading/page/app.loading.page.service';

import {
  Sale,
  SaleDetails,
  SaleProduct,
  ProductPictureData,
} from '../../_models';

import {
  SaleProductService,
  MarketMenuService,
  SaleService,
  ProductPictureService,
  SaleDetailsService,
} from '../../_service';

@Component({
  selector: 'app-product-manage',
  templateUrl: './sale.details.products.manage.component.html',
  styleUrls: ['./sale.details.products.manage.component.scss'],
})
export class SaleDetailsProductsManageComponent implements OnInit {

  itemsStepsMenu: MenuItem[];
  navigationMenu: MenuItem[];
  colsOfProductsTable: any[];

  fetchIsSale = false;
  fetchSaleId: number;
  fetchParentId: number;

  currentSale: Sale;
  currentGroupDetails: SaleDetails;
  currentProducts: SaleProduct[];

  selectedProduct: SaleProduct;
  saleProductToDelete: SaleProduct;

  display = false;
  indexProductView = 0;

  constructor(
    private saleService: SaleService,
    private saleDetailsService: SaleDetailsService,
    private saleProductService: SaleProductService,
    private productPictureService: ProductPictureService,
    private menuService: MarketMenuService,
    private loadingPageService: LoadingPageService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initialize().subscribe(
      (parent) => {
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

  private initialize() {
    this.loadingPageService.present();
    this.itemsStepsMenu = this.menuService.getItemsNewSaleSteps();
    this.generateColsOfProducrsTable();
    this.generateNavigationMenu();
    return this.route.queryParams.pipe(
      take(1),
      switchMap((params) => {
        this.fetchSaleId = params.saleId;
        this.fetchParentId = params.parentId;
        this.fetchIsSale =
          params.nodeOfSale != null
            ? Boolean(JSON.parse(params.nodeOfSale))
            : false;
        return this.saleService.getSale(this.fetchSaleId);
      }),
      take(1),
      switchMap((sale) => {
        this.currentSale = sale;
        if (this.fetchIsSale === true) {
          return of(null);
        } else {
          return this.saleDetailsService.getSaleDetailsById(this.fetchParentId);
        }
      }),
      take(1),
      switchMap((groupDetails) => {
        this.currentGroupDetails = groupDetails;
        if (this.fetchIsSale === true) {
          return this.saleProductService.getProductsOfSale(this.fetchParentId);
        } else {
          this.fetchIsSale = false;
          return this.saleProductService.getProductsOfSaleDetails(
            this.fetchParentId
          );
        }
      }),
      take(1),
      mergeMap((products) => {
        this.currentProducts = products;
        return from(this.currentProducts).pipe(
          concatMap((product) =>
            this.productPictureService.getProductPictures(product.id)
          )
        );
      }),
      pipe(),
      switchMap((pictures) => {
        this.addPicturesToProduct(pictures);
        return this.saleDetailsService.getSaleDetailsById(this.fetchParentId);
      })
    );
  }

  addPicturesToProduct(productPictures: ProductPictureData[]) {
    const idProduct = productPictures[0].productId;
    for (const product of this.currentProducts) {
      if (product.id === idProduct) {
        for (const picture of productPictures) {
          picture.source =
            RestConfig.FILES_HOST + picture.picturePath + picture.pictureName;
          picture.thumbnail =
            RestConfig.FILES_HOST + picture.picturePath + picture.thumbnail;
          picture.title = product.label;
        }
        product.havePictures = true;
        product.productPictures = productPictures;
      }
    }
  }

  /** Store */
  public addProduct() {
    const product = new SaleProduct();
    product.label = '';

    product.editable = true;
    product.actionStore = true;
    product.index = this.indexProductView++;
    if (this.currentProducts == null) {
      this.currentProducts = new Array();
    }
    this.currentProducts.unshift(product);
  }

  public confirmStoreProduct(rowProduct: SaleProduct) {
    if (this.fetchIsSale) {
      const parentSale = new Sale().buildSaleWithId(this.fetchParentId);
      rowProduct.saleParent = parentSale;
    } else {
      const parentSaleDetails = new SaleDetails();
      parentSaleDetails.id = this.fetchParentId;
      rowProduct.saleDetailsParent = parentSaleDetails;
    }
    let salProducteObs: Observable<SaleProduct>;
    salProducteObs = this.saleProductService.addSaleProduct(rowProduct);
    salProducteObs.subscribe(
      (storedProduct) => {
        rowProduct.editable = false;
        rowProduct.actionStore = false;
        rowProduct.id = storedProduct.id;
        this.messageService.add({
          severity: 'success',
          summary: 'Service maket',
          detail: 'Produit ajouté avec succès',
          life: 6000
        });
      },
      (errRes) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service market',
          detail: 'Probléme d\'ajout de produit',
          life: 6000
        });
      }
    );
  }

  public ignoreStoreProduct(rowProduct: SaleProduct) {
    this.deleteProductByIndex(rowProduct.index);
    rowProduct.actionStore = false;
  }

  public deleteProductByIndex(index: number) {
    for (let _i = 0; _i < this.currentProducts.length; _i++) {
      if (this.currentProducts[_i].index === index) {
        this.currentProducts.splice(_i, 1);
      }
    }
  }
  /** Update */
  public confirmUpdateProduct(rowProduct) {
    let salProducteObs: Observable<SaleProduct>;
    salProducteObs = this.saleProductService.updateSaleProduct(rowProduct);
    salProducteObs.subscribe(
      (restData) => {
        rowProduct.editable = false;
        rowProduct.actionEdit = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Service maket',
          detail: 'Produit mis à jour avec succès',
          life: 6000
        });
      },
      (errRes) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service market',
          detail: 'Probléme de mise à jour de produit',
          life: 6000
        });
      }
    );
  }
  public enableEditModeProduct(rowProduct: SaleProduct) {
    rowProduct.editable = true;
    rowProduct.actionEdit = true;
  }

  public disabelEditModeProduct(rowProduct: SaleProduct) {
    rowProduct.editable = false;
    rowProduct.actionEdit = false;
  }
  /** delete */
  onDeleteProduct() {
    this.display = false;

    let deleteObs: Observable<SaleProduct>;
    deleteObs = this.saleProductService.deleteSaleProduct(
      this.saleProductToDelete.id
    );
    deleteObs.subscribe(
      (deletedSaleProduct) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Service maket',
          detail: 'Produit supprimé avec succès',
          life: 6000
        });
        this.deleteProductById(deletedSaleProduct.id);
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service market',
          detail: 'Probléme de suppression de groupe détails',
          life: 6000
        });
      }
    );
  }

  confirmDeleteProduct(saleProduct: SaleProduct) {
    this.saleProductToDelete = saleProduct;
    this.display = true;
  }

  public deleteProductById(id: number) {
    for (let _i = 0; _i < this.currentProducts.length; _i++) {
      if (this.currentProducts[_i].id === id) {
        this.currentProducts.splice(_i, 1);
      }
    }
  }

  /** Navigation */
  showPicturesOfProduct(event, overlaypanel) {
    overlaypanel.toggle(event);
  }

  goProductCriterion() {
    this.router.navigate(['/administrator/market/criterion'], {
      queryParams: {
        saleId: this.fetchSaleId,
        parentId: this.fetchParentId,
        productId: this.selectedProduct.id,
        nodeOfSale: this.fetchIsSale,
      },
    });
  }

  goProductPictures() {
    this.router.navigate(['/administrator/market/pictures'], {
      queryParams: {
        saleId: this.fetchSaleId,
        parentId: this.fetchParentId,
        productId: this.selectedProduct.id,
        nodeOfSale: this.fetchIsSale,
      },
    });
  }

  goSaleDetails() {
    this.router.navigate(['/administrator/market/sale-details'], {
      queryParams: { saleId: this.fetchSaleId },
    });
  }

  /** Tools */
  private generateNavigationMenu() {
    this.navigationMenu = [
      {
        label: 'Critéres',
        command: () => {
          this.goProductCriterion();
        },
      },
      {
        label: 'Images',
        command: () => {
          this.goProductPictures();
        },
      },
    ];
  }

  private generateColsOfProducrsTable() {
    this.colsOfProductsTable = [
      { field: 'label', header: 'Labelle' },
      { field: 'description', header: 'Description' },
      { field: 'price', header: 'Prix' },
      { field: 'percentage', header: 'Réduction' },
      { field: 'stock', header: 'Stock' },
    ];
  }

}
