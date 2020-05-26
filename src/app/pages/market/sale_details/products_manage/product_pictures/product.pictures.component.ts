import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { MenuItem, MessageService } from 'primeng/api';

import { RestConfig } from '../../../../../common/services/rest/rest.config';
import { ErrorCode } from '../../../../../common';

import {
    MarketMenuService,
    ProductPictureService,
    SaleProductService,
} from '../../../_service';

import {
    ProductPictureData,
    SaleProduct,
    ProductPictureRank,
} from '../../../_models';

@Component({
    selector: 'app-sale-product-pictures',
    templateUrl: './product.pictures.component.html',
    styleUrls: ['./product.pictures.component.scss'],
})
export class ProductPicturesComponent implements OnInit {
    fileServerUrl = RestConfig.FILES_HOST;
    itemsStepsMenu: MenuItem[];

    fetchProductId: number;
    fetchSaleId: number;
    fetchParentId: number;
    fetchIsSale = false;

    currrentProduct: SaleProduct;

    productPicturesToUpload: any[] = [];
    productPicturesStored: ProductPictureData[] = [];
    picturesRank: ProductPictureRank[] = [];
    productPictureToDelete: ProductPictureData;

    confirmDeletePicture = false;
    indexPicture = 0;


    constructor(
        private saleProductService: SaleProductService,
        private productPictureService: ProductPictureService,
        private marketMenuService: MarketMenuService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initialize().subscribe(
            (parent) => { },
            (errors) => {
                if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
                    this.router.navigate(['/administrator/market/sale-add']);
                }
            }
        );
    }

    initialize() {
        this.itemsStepsMenu = this.marketMenuService.getItemsNewSaleSteps();
        return this.route.queryParams.pipe(
            take(1),
            switchMap((params) => {
                this.fetchSaleId = params.saleId;
                this.fetchParentId = params.parentId;
                this.fetchProductId = params.productId;
                this.fetchIsSale =
                    params.nodeOfSale != null
                        ? Boolean(JSON.parse(params.nodeOfSale))
                        : false;
                // TODO when product not exist
                return this.saleProductService.getProductsById(this.fetchProductId);
            }),
            take(1),
            switchMap((product) => {
                this.currrentProduct = product;
                return this.productPictureService.getProductPictures(product.id);
            }),
            take(1),
            tap((pictures) => {
                this.productPicturesStored = pictures;
                if (this.productPicturesStored.length > 0) {
                    this.fillRanks();
                }
            })
        );
    }

    fillRanks() {
        for (let _i = 1; _i <= this.productPicturesStored.length; _i++) {
            const rank = new ProductPictureRank();
            rank.id = _i;
            rank.label = 'Rang ' + _i;
            this.picturesRank.push(rank);
        }
    }

    onProductPictureSelect(event) {
        for (const file of event.files) {
            file.indexPicture = this.indexPicture++;
            file.haveRank = true;
            this.productPicturesToUpload.push(file);
            const rank = new ProductPictureRank();
            rank.id = Number(this.picturesRank.length) + 1;
            rank.label = 'Rang ' + (Number(this.picturesRank.length) + 1);
            this.picturesRank.push(rank);
        }
    }

    onUploadProductPicture(productPicture) {
        if (productPicture.rank == null) {
            productPicture.haveRank = false;
            return;
        }
        let uploadObs: Observable<ProductPictureData>;
        uploadObs = this.productPictureService.uploadProductPicture(
            productPicture,
            productPicture.rank.id,
            this.currrentProduct.id
        );
        uploadObs.subscribe(
            (pictureData) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Service documents',
                    detail: 'Image téléchargée avec succès',
                    life: 6000,
                });
                this.onDeleteLocalPicture(productPicture);
                this.productPicturesStored.unshift(pictureData);
            },
            (errRes) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Service documents',
                    detail: 'Probléme de téléchargement de l\'image',
                    life: 6000
                });
            }
        );
    }

    onDeleteLocalPicture(productPicture) {
        for (let _i = 0; _i < this.productPicturesToUpload.length; _i++) {
            if (
                this.productPicturesToUpload[_i].indexPicture ===
                productPicture.indexPicture
            ) {
                this.productPicturesToUpload.splice(_i, 1);
            }
        }
    }

    onDeletePicture(productPictureData: ProductPictureData) {
        this.productPictureToDelete = productPictureData;
        this.confirmDeletePicture = true;
    }

    onDeleteProductPicture() {
        this.confirmDeletePicture = false;
        let deleteObs: Observable<ProductPictureData>;
        deleteObs = this.productPictureService.deleteProductPicture(
            this.productPictureToDelete.id
        );
        deleteObs.subscribe(
            (deleteProductCriteria) => {
                this.onDeleteStoragePicture(deleteProductCriteria);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Service documents',
                    detail: 'Image supprimer avec succès',
                    life: 6000
                });
            },
            (err) => {

                this.messageService.add({
                    severity: 'error',
                    summary: 'Service documents',
                    detail: 'Probléme de suppression de l\'image',
                    life: 6000
                });
            }
        );
    }

    onDeleteStoragePicture(productPicture) {
        for (let _i = 0; _i < this.productPicturesStored.length; _i++) {
            if (this.productPicturesStored[_i].id === productPicture.id) {
                this.productPicturesStored.splice(_i, 1);
            }
        }
    }

    goProductsManage() {
        this.router.navigate(['/administrator/market/sale-products-manage'], {
            queryParams: {
                saleId: this.fetchSaleId,
                parentId: this.fetchParentId,
                nodeOfSale: this.fetchIsSale,
            },
        });
    }
}
