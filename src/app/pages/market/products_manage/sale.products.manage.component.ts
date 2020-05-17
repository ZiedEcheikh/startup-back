import { Component, OnInit } from '@angular/core';
import { take, switchMap, tap } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleProduct, Sale } from '../_models';
import { LoadingPageService } from '../../../theme/loading/page/app.loading.page.service';

import { SaleProductService, MenuService, SaleService } from '../_service';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { ErrorCode } from 'src/app/common';
import { Observable } from 'rxjs';
import { SaleDetails } from '../_models/sale.details.model';
@Component({
  selector: 'app-product-manage',
  templateUrl: './sale.products.manage.component.html',
  styleUrls: ['./sale.products.manage.component.scss']
})

export class SaleProductsManageComponent implements OnInit {
  stepsItems: MenuItem[];
  selectedType: string;
  uploadedFiles: any[] = [];
  currentProducts: SaleProduct[];
  selectedProduct: SaleProduct;
  cols: any[];
  images: any[];
  isSale = false;
  currentSaleId: number;
  parentId: number;
  currentSale: Sale;
  display = false;
  saleProductToDelete: SaleProduct;
  selectedProductView: SaleProduct;
  saleProductView: SaleProduct[];
  indexProductView = 0;
  items: MenuItem[];
  marginStyle: any;
  constructor(private saleService: SaleService, private saleProductService: SaleProductService, private menuService: MenuService,
    private loadingPageService: LoadingPageService, private route: ActivatedRoute, private router: Router) {
    this.stepsItems = this.menuService.getItemsNewSaleSteps();

    this.cols = [
      { field: 'label', header: 'Labelle' },
      { field: 'description', header: 'Description' },
      { field: 'price', header: 'Prix' },
      { field: 'percentage', header: 'Réduction' },
      { field: 'stock', header: 'Stock' }
    ];

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
    this.marginStyle = { top: '300px' };
    this.items = [
      {
        label: 'Critéres', command: () => {
          this.goProductCriterion();
        }
      },
      {
        label: 'Images', command: () => {
          this.goProductPictures();
        }
      }
    ];

    this.initialize().subscribe(parent => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    },
      errors => {
        setTimeout(() => this.loadingPageService.dismiss(), 2000);
        if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
          this.router.navigate(['/administrator/market/sale-add']);
        }
      }
    );
  }
  testContext() {
    console.log(this.selectedProductView);
  }
  initialize() {
    this.loadingPageService.present();
    return this.route.queryParams.pipe(
      take(1),
      switchMap(params => {
        this.currentSaleId = params.saleId;
        this.parentId = params.parentId;
        this.isSale = params.nodeOfSale != null ? Boolean(JSON.parse(params.nodeOfSale)) : false;
        return this.saleService.getSale(this.currentSaleId);
      }),
      take(1),
      switchMap(sale => {
        this.currentSale = sale;
        if (this.isSale === true) {
          return this.saleProductService.getProductsOfSale(this.parentId);
        } else {
          this.isSale = false;
          return this.saleProductService.getProductsOfSaleDetails(this.parentId);
        }
      }),
      take(1),
      tap(data => {
        this.saleProductView = data;
      })
    );
  }
  confirmDeleteProduct(saleProduct: SaleProduct) {
    this.saleProductToDelete = saleProduct;
    this.display = true;
  }

  onDeleteProduct() {
    this.display = false;
    this.loadingPageService.present();
    let deleteObs: Observable<SaleProduct>;
    deleteObs = this.saleProductService.deleteSaleProduct(this.saleProductToDelete.id);
    deleteObs.subscribe(deletedSaleProduct => {
      this.ngOnInit();
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    }, err => {
      setTimeout(() => this.loadingPageService.dismiss(), 2000);
    });
  }

  public enableEditModeProduct(rowProduct: SaleProduct) {
    rowProduct.editable = true;
    rowProduct.actionEdit = true;
  }

  public disabelEditModeProduct(rowProduct) {
    rowProduct.editable = false;
    rowProduct.actionEdit = false;
  }

  public confirmUpdateProduct(rowProduct) {
    let salProducteObs: Observable<SaleProduct>;
    salProducteObs = this.saleProductService.updateSaleProduct(rowProduct);
    salProducteObs.subscribe(restData => {
      rowProduct.editable = false;
      rowProduct.actionEdit = false;
    }, errRes => {

    });
  }

  public addProduct() {
    const product = new SaleProduct();
    product.label = '';

    product.editable = true;
    product.actionStore = true;
    product.index = this.indexProductView++;
    this.saleProductView.unshift(product);
  }

  public confirmStoreProduct(rowProduct) {
    if (this.isSale) {
      const parentSale = new Sale().buildSaleWithId(this.parentId);
      rowProduct.saleParent = parentSale;
    } else {
      const parentSaleDetails = new SaleDetails();
      parentSaleDetails.id = this.parentId;
      rowProduct.saleDetailsParent = parentSaleDetails;
    }
    let salProducteObs: Observable<SaleProduct>;
    salProducteObs = this.saleProductService.addSaleProduct(rowProduct);
    salProducteObs.subscribe(restData => {
      rowProduct.editable = false;
      rowProduct.actionStore = false;
      //TODO : toaster msg success save
    }, errRes => {
      //TODO : toaster msg error save
    });
  }

  public ignoreStoreProduct(rowProduct: SaleProduct) {
    this.deleteProductBy(rowProduct.index);
    rowProduct.actionStore = false;
  }

  public deleteProductBy(index: number) {
    for (let _i = 0; _i < this.saleProductView.length; _i++) {
      if (this.saleProductView[_i].index === index) {
        this.saleProductView.splice(_i, 1);
      }
    }
  }
  /** To clean*/

  goProductCriterion() {
    this.router.navigate(['/administrator/market/criterion'],
      {
        queryParams: {
          saleId: this.currentSaleId,
          parentId: this.parentId,
          productId: this.selectedProductView.id,
          nodeOfSale: this.isSale
        }
      });
  }

  goProductPictures() {
    this.router.navigate(['/administrator/market/pictures'],
      {
        queryParams: {
          saleId: this.currentSaleId,
          parentId: this.parentId,
          productId: this.selectedProductView.id,
          nodeOfSale: this.isSale
        }
      });
  }
  goNext() {
    this.router.navigate(['/administrator/market/sale-recap'], { queryParams: { saleId: this.currentSaleId } });
  }
  goBack() {
    this.router.navigate(['/administrator/market/sale-details'], { queryParams: { saleId: this.currentSaleId } });
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
