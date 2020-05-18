import { Component, OnInit } from '@angular/core';
import { take, switchMap, tap } from 'rxjs/operators';
import { SaleProductService, ProductCriteriaService, MenuService } from '../../_service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingPageService } from 'src/app/theme';
import { MenuItem } from 'primeng/api/menuitem';
import { ProductChoiceCriteria, SaleProduct, ProductCriteria } from '../../_models';
import { ErrorCode } from 'src/app/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-sale-product-criteria',
    templateUrl: './product.criteria.component.html',
    styleUrls: ['./product.criteria.component.scss']
})

export class ProductCriteriaComponent implements OnInit {

    productId: number;
    currentSaleId: number;
    parentId: number;
    isSale = false;
    stepsItems: MenuItem[];
    items: MenuItem[];
    cols: any[];
    currrentProduct: SaleProduct;
    currentCriterion: ProductCriteria[];
    productCriteriaToDelete: ProductCriteria;
    productChoiceCriteriaToDelete: ProductChoiceCriteria;
    indexProductCriteria = 0;
    display = false;
    displayChoice = false;
    indexChoice = 0;
    constructor(private saleProductService: SaleProductService,
        private productCriteriaService: ProductCriteriaService,
        private menuService: MenuService,
        private route: ActivatedRoute,
        private router: Router,
        private loadingPageService: LoadingPageService) {
        this.stepsItems = this.menuService.getItemsNewSaleSteps();
    }

    ngOnInit() {
        this.cols = [
            { field: 'label', header: 'Libellé' },
            { field: 'description', header: 'Description' },
            { field: 'quantity', header: 'Quantité' }
        ];

        this.items = [
            {
                label: 'Critére Simple', command: () => {
                    this.addCriteria();
                }
            },
            {
                label: 'Critére Liste', command: () => {
                    this.addChoiceCriteria();
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
            });
    }

    initialize() {
        this.loadingPageService.present();
        return this.route.queryParams.pipe(
            take(1),
            switchMap(params => {
                this.productId = params.productId;
                this.currentSaleId = params.saleId;
                this.parentId = params.parentId;
                this.isSale = params.nodeOfSale != null ? Boolean(JSON.parse(params.nodeOfSale)) : false;
                // TODO when productId not exist
                return this.saleProductService.getProductsById(this.productId);
            }),
            take(1),
            switchMap(product => {
                this.currrentProduct = product;
                return this.productCriteriaService.getCriterionOfProduct(product.id);
            }),
            take(1),
            tap(criterion => {
                this.currentCriterion = criterion;
                this.updateChoicePriority();
            })
        );
    }
  
    enableEditModeCriteria(criteria: ProductCriteria) {
        criteria.editable = true;
        criteria.actionEdit = true;
    }

    confirmUpdateCriteria(criteria: ProductCriteria) {
        let productCriteriaObs: Observable<ProductCriteria>;
        productCriteriaObs = this.productCriteriaService.updateCriterionOfProduct(criteria);
        productCriteriaObs.subscribe(restData => {
            criteria.editable = false;
            criteria.actionEdit = false;
        }, errRes => {
        });
    }


    disabelEditModeCriteria(criteria: ProductCriteria) {
        criteria.editable = false;
        criteria.actionEdit = false;
    }

    confirmStoreCriteria(criteria: ProductCriteria) {
        const productOfCriteria = new SaleProduct();
        productOfCriteria.id = this.productId;
        criteria.product = productOfCriteria;
        let producteCriteriaObs: Observable<ProductCriteria>;
        producteCriteriaObs = this.productCriteriaService.saveCriterionOfProduct(criteria);
        producteCriteriaObs.subscribe(restData => {
            criteria.editable = false;
            criteria.actionStore = false;
            criteria.id = restData.id;
            //TODO : toaster msg success save
        }, errRes => {
            //TODO : toaster msg error save
        });
    }

    public addCriteria() {
        const criteria = new ProductCriteria();
        criteria.label = '';
        criteria.editable = true;
        criteria.actionStore = true;
        criteria.index = this.indexProductCriteria++;
        if (this.currentCriterion == null) {
            this.currentCriterion = new Array();
        }
        this.currentCriterion.unshift(criteria);
    }

    public addChoiceCriteria() {
        const criteria = new ProductCriteria();
        criteria.label = '';
        criteria.editable = true;
        criteria.actionStore = true;
        criteria.index = this.indexProductCriteria++;

        if (this.currentCriterion == null) {
            this.currentCriterion = new Array();
        }
        if (this.haveAlreadyChoicePriority()) {
            criteria.canBechoicePriority = false;
        }

        criteria.choiceCriterion = new Array();
        this.currentCriterion.unshift(criteria);
    }
    ignoreStoreCriteria(criteria: ProductCriteria) {
        this.deleteCriteriaBy(criteria.index);
        criteria.actionStore = false;
    }

    confirmDeleteCriteria(criteria: ProductCriteria) {
        this.productCriteriaToDelete = criteria;
        this.display = true;
    }

    onDeleteCriteria() {
        this.display = false;
        this.loadingPageService.present();
        let deleteObs: Observable<ProductCriteria>;
        deleteObs = this.productCriteriaService.deleteProductCriteria(this.productCriteriaToDelete.id);
        deleteObs.subscribe(deleteProductCriteria => {
            this.ngOnInit();
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
        }, err => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
        });
    }
    public deleteCriteriaBy(index: number) {
        for (let _i = 0; _i < this.currentCriterion.length; _i++) {
            if (this.currentCriterion[_i].index === index) {
                this.currentCriterion.splice(_i, 1);
            }
        }
    }

    enableEditModeChoiceCriteria(productChoiceCriteria: ProductChoiceCriteria) {
        productChoiceCriteria.editable = true;
        productChoiceCriteria.actionEdit = true;
        productChoiceCriteria.actionStore = false;
    }


    confirmUpdateChoiceCriteria(productChoiceCriteria: ProductChoiceCriteria, productCriteria: ProductCriteria) {
        this.confirmStoreCriteria(productCriteria);
        productChoiceCriteria.editable = false;
        productChoiceCriteria.actionEdit = false;
    }

    disabelEditModeChoiceCriteria(productChoiceCriteria: ProductChoiceCriteria) {
        productChoiceCriteria.editable = false;
        productChoiceCriteria.actionEdit = false;
    }
    addChoice(choiceCriterion: ProductChoiceCriteria[]) {
        const choiceCriteria = new ProductChoiceCriteria();
        choiceCriteria.label = '';
        choiceCriteria.editable = true;
        choiceCriteria.actionStore = true;
        choiceCriteria.index = this.indexChoice++;
        choiceCriterion.unshift(choiceCriteria);
    }
    confirmStoreChoiceCriteria(productChoiceCriteria: ProductChoiceCriteria, productCriteria: ProductCriteria) {
        this.confirmStoreCriteria(productCriteria);
        productChoiceCriteria.editable = false;
        productChoiceCriteria.actionStore = false;
    }

    ignoreStoreChoiceCriteria(productChoiceCriteria: ProductChoiceCriteria, choiceCriterion: ProductChoiceCriteria[]) {
        this.deleteChoiceCriteriaBy(productChoiceCriteria.index, choiceCriterion);
        productChoiceCriteria.actionStore = false;
    }

    public deleteChoiceCriteriaBy(index: number, choiceCriterion: ProductChoiceCriteria[]) {
        for (let _i = 0; _i < choiceCriterion.length; _i++) {
            if (choiceCriterion[_i].index === index) {
                choiceCriterion.splice(_i, 1);
            }
        }
    }
    updateOtherCriteria() {
        this.updateChoicePriority();
    }
    haveAlreadyChoicePriority() {
        for (const criteria of this.currentCriterion) {
            if (criteria.choiceCriterion != null && criteria.choicePriority === true) {
                return true;
            }
        }
        return false;
    }

    updateChoicePriority() {
        if (this.haveAlreadyChoicePriority()) {
            for (const criteria of this.currentCriterion) {
                if (criteria.choicePriority === true) {
                    criteria.canBechoicePriority = true;
                } else {
                    criteria.canBechoicePriority = false;
                }
            }
        } else {
            for (const criteria of this.currentCriterion) {
                criteria.canBechoicePriority = true;
            }
        }
    }

    confirmDeleteChoiceCriteria(productChoiceCriteria: ProductChoiceCriteria) {
        this.productChoiceCriteriaToDelete = productChoiceCriteria;
        this.displayChoice = true;
    }
    onDeleteChoieCriteria() {
        this.displayChoice = false;
        this.loadingPageService.present();
        let deleteObs: Observable<ProductCriteria>;
        deleteObs = this.productCriteriaService.deleteChoiceCriteria(this.productChoiceCriteriaToDelete.id);
        deleteObs.subscribe(deleteProductCriteria => {
            this.ngOnInit();
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
        }, err => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
        });
    }

    goProductsManage() {
        this.router.navigate(['/administrator/market/sale-products-manage'],
            {queryParams: {saleId: this.currentSaleId , parentId: this.parentId, nodeOfSale: this.isSale } });
    }
}
