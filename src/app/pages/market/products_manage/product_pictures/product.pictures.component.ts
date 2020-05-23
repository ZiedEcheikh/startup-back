import { Component, OnInit } from '@angular/core';
import { RestConfig } from '../../../../common/services/rest/rest.config';
import { MarketMenuService, ProductPictureService, SaleProductService } from '../../_service';
import { MenuItem } from 'primeng/api/menuitem';
import { Observable } from 'rxjs';
import { ProductPictureData, SaleProduct, ProductPictureRank } from '../../_models';
import { take, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorCode } from 'src/app/common';

@Component({
    selector: 'app-sale-product-pictures',
    templateUrl: './product.pictures.component.html',
    styleUrls: ['./product.pictures.component.scss']
})

export class ProductPicturesComponent implements OnInit {
    fileServerUrl = RestConfig.FILES_HOST;
    stepsItems: MenuItem[];
    productId: number;
    currentSaleId: number;
    parentId: number;
    isSale = false;
    productPicturesToUpload: any[] = [];
    productPicturesStored: ProductPictureData[] = [];
    currrentProduct: SaleProduct;
    confirmDeletePicture = false;
    indexPicture = 0;
    productPictureToDelete: ProductPictureData;
    picturesRank: ProductPictureRank[] = [];
    constructor(
        private saleProductService: SaleProductService,
        private productPictureService: ProductPictureService,
        private route: ActivatedRoute,
        private router: Router,
        private marketMenuService: MarketMenuService) {
        this.stepsItems = this.marketMenuService.getItemsNewSaleSteps();
    }

    ngOnInit(): void {

        this.initialize().subscribe(parent => {
        },
            errors => {
                if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
                    this.router.navigate(['/administrator/market/sale-add']);
                }
            });
    }

    initialize() {
        return this.route.queryParams.pipe(
            take(1),
            switchMap(params => {
                this.productId = params.productId;
                this.currentSaleId = params.saleId;
                this.parentId = params.parentId;
                this.isSale = params.nodeOfSale != null ? Boolean(JSON.parse(params.nodeOfSale)) : false;
                // TODO when product not exist
                return this.saleProductService.getProductsById(this.productId);
            }),
            take(1),
            switchMap(product => {
                this.currrentProduct = product;
                return this.productPictureService.getProductPictures(product.id);
            }),
            take(1),
            tap(pictures => {
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
        uploadObs = this.productPictureService.uploadProductPicture(productPicture, productPicture.rank.id, this.currrentProduct.id);
        uploadObs.subscribe(pictureData => {
            this.onDeleteLocalPicture(productPicture);
            this.productPicturesStored.unshift(pictureData);
        }, errRes => {
        });
    }

    onDeleteLocalPicture(productPicture) {
        for (let _i = 0; _i < this.productPicturesToUpload.length; _i++) {
            if (this.productPicturesToUpload[_i].indexPicture === productPicture.indexPicture) {
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
        deleteObs = this.productPictureService.deleteProductPicture(this.productPictureToDelete.id);
        deleteObs.subscribe(deleteProductCriteria => {
            this.onDeleteStoragePicture(deleteProductCriteria);
        }, err => {
        });
    }

    onDeleteStoragePicture(productPicture) {
        for (let _i = 0; _i < this.productPicturesToUpload.length; _i++) {
            if (this.productPicturesToUpload[_i].id === productPicture.id) {
                this.productPicturesToUpload.splice(_i, 1);
            }
        }
    }

    goProductsManage() {
        this.router.navigate(['/administrator/market/sale-products-manage'],
            {queryParams: {saleId: this.currentSaleId , parentId: this.parentId, nodeOfSale: this.isSale } });
    }
}
