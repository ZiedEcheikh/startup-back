import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';

import { SaleDetailsService, MenuService, SaleService, SaleProductService } from '../../_service';
import { Router, ActivatedRoute } from '@angular/router';
import { take, switchMap, tap } from 'rxjs/operators';
import { Sale, SaleProduct } from '../../_models';
import { SaleDetails } from '../../_models/sale.details.model';
import { ErrorCode } from 'src/app/common';
import { Observable, of } from 'rxjs';
import { LoadingPageService } from 'src/app/theme';


@Component({
    selector: 'app-sale-product',
    templateUrl: './product.create.update.component.html',
    styleUrls: ['./product.create.update.component.scss']
})

export class SaleProductCreateUpdateComponent implements OnInit {
    stepsItems: MenuItem[];
    cols: any[];
    isSale = false;
    parentId: number;
    currentSale: Sale;
    currentSaleDetails: SaleDetails;
    selectedSaleDetail: Sale;
    currentProduct: SaleProduct;
    parentSaleDetails: SaleDetails;
    saleDetailsToUpdate: SaleDetails;
    fetchSaleId: number;
    currentProductId: number;
    label: string;
    description: string;
    price: number;
    percentage: number;
    stock: number;
    items: MenuItem[];

    constructor(private saleService: SaleService, private saleDetailsService: SaleDetailsService,
        private saleProductService: SaleProductService, private menuService: MenuService,
        private route: ActivatedRoute, private router: Router, private loadingPageService: LoadingPageService) {
        this.stepsItems = this.menuService.getItemsNewSaleSteps();
    }

    ngOnInit() {
        this.initialize().subscribe(parent => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
            console.log(parent);
        },
            errors => {
                setTimeout(() => this.loadingPageService.dismiss(), 2000);
                if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
                    this.router.navigate(['/administrator/market/sale-add']);
                }
            }
        );
    }

    initialize() {
        this.loadingPageService.present();
        return this.route.queryParams.pipe(
            take(1),
            switchMap(params => {
                this.fetchSaleId = params.saleId; // TODO : check retrieve sale id or redirecte
                this.parentId = params.parentId;
                this.currentProductId = params.productId;
                this.isSale = Boolean(JSON.parse(params.nodeOfSale));
                if (this.isSale) {
                    return this.saleService.getSale(this.parentId);
                } else {
                    return this.saleDetailsService.getSaleDetailsById(this.parentId);
                }
            }),
            take(1),
            switchMap(parentOfProduct => {
                if (this.isSale) {
                    this.currentSale = parentOfProduct;
                } else {
                    this.currentSaleDetails = parentOfProduct;
                }
                return this.saleProductService.getProductsById(this.currentProductId);
            }),
            take(1),
            tap(product => {
                this.currentProduct = product;
                this.label = product.label;
                this.description = product.description;
                this.price = product.price;
                this.percentage = product.percentage;
                this.stock = product.stock;
            })
        );
    }

    saveSaleProduct(saleProduct: SaleProduct) {
        this.loadingPageService.present();
        let salProducteObs: Observable<SaleProduct>;
        salProducteObs = this.saleProductService.addSaleProduct(saleProduct);
        salProducteObs.subscribe(restData => {
            this.currentProductId = restData.id;
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
            this.goProductCriteriaManage();
            console.log(restData);
        }, errRes => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
            console.log(errRes);
        });
    }

    updateSaleProduct(saleProduct: SaleProduct) {
        this.loadingPageService.present();
        let salProducteObs: Observable<SaleProduct>;
        salProducteObs = this.saleProductService.updateSaleProduct(saleProduct);
        salProducteObs.subscribe(restData => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
            this.goProductCriteriaManage();
            console.log(restData);
        }, errRes => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
            console.log(errRes);
        });
    }
    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const label = form.value.label;
        const description = form.value.description;
        const price = form.value.price;
        const percentage = form.value.percentage;
        const stock = form.value.percentage;
        const saleProductToSave = new SaleProduct();
        saleProductToSave.label = label;
        saleProductToSave.description = description;
        saleProductToSave.price = price;
        saleProductToSave.percentage = percentage;
        saleProductToSave.stock = stock;
        if (this.isSale) {
            const parentSale = new Sale().buildSaleWithId(this.currentSale.id);
            saleProductToSave.saleParent = parentSale;
        } else {
            const parentSaleDetails = new SaleDetails();
            parentSaleDetails.id = this.currentSaleDetails.id;
            saleProductToSave.saleDetailsParent = parentSaleDetails;
        }

        if (this.currentProductId != null) {
            saleProductToSave.id = this.currentProduct.id;
            this.updateSaleProduct(saleProductToSave);
        } else {
            this.saveSaleProduct(saleProductToSave);
        }
        form.reset();
    }

    goBack() {
        this.goSaleProductManage();
    }
    goSaleProductManage() {
        this.router.navigate(['/administrator/market/sale-products-manage'],
            { queryParams: { saleId: this.fetchSaleId, parentId: this.parentId, nodeOfSale: this.isSale } });
    }

    goProductCriteriaManage() {
        this.router.navigate(['/administrator/market/criteria-product'],
            {
                queryParams: {
                    saleId: this.fetchSaleId, parentId: this.parentId,
                    productId: this.currentProductId, nodeOfSale: this.isSale
                }
            });
    }


}
