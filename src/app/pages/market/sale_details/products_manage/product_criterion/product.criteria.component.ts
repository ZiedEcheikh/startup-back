import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { MenuItem, MessageService } from 'primeng/api';

import { ErrorCode } from '../../../../../common';

import { LoadingPageService } from '../../../../../theme/loading/page/app.loading.page.service';

import {
    SaleProductService,
    ProductCriteriaService,
    MarketMenuService,
} from '../../../_service';

import {
    ProductChoiceCriteria,
    SaleProduct,
    ProductCriteria,
} from '../../../_models';

@Component({
    selector: 'app-sale-product-criteria',
    templateUrl: './product.criteria.component.html',
    styleUrls: ['./product.criteria.component.scss'],
})
export class ProductCriteriaComponent implements OnInit {
    itemsStepsMenu: MenuItem[];
    itemsContextMenu: MenuItem[];
    colsTableColsChoiceCriterai: any[];

    fetchProductId: number;
    fetchSaleId: number;
    fetchParentId: number;
    fetchIsSale = false;

    currrentProduct: SaleProduct;
    currentCriterion: ProductCriteria[];

    productCriteriaToDelete: ProductCriteria;
    productChoiceCriteriaToDelete: ProductChoiceCriteria;
    productChoicesCriteriaToDelete: ProductChoiceCriteria[];

    display = false;
    displayChoice = false;

    indexProductCriteria = 0;
    indexChoice = 0;

    constructor(
        private saleProductService: SaleProductService,
        private productCriteriaService: ProductCriteriaService,
        private loadingPageService: LoadingPageService,
        private marketMenuService: MarketMenuService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadingPageService.present();
        this.initialize().subscribe(
            (parent) => {
                setTimeout(() => this.loadingPageService.dismiss(), 2000);
            },
            (errors) => {
                setTimeout(() => this.loadingPageService.dismiss(), 2000);
                if (errors.error.errorCode === ErrorCode.NOT_SALE_EXIST) {
                    this.router.navigate(['/administrator/market/sale-add']);
                }
            }
        );
    }

    initialize() {
        this.itemsStepsMenu = this.marketMenuService.getItemsNewSaleSteps();
        this.generateContextMenu();
        this.generateTableColsChoiceCriterai();
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
                // TODO when productId not exist
                return this.saleProductService.getProductsById(this.fetchProductId);
            }),
            take(1),
            switchMap((product) => {
                this.currrentProduct = product;
                return this.productCriteriaService.getCriterionOfProduct(product.id);
            }),
            take(1),
            tap((criterion) => {
                this.currentCriterion = criterion;
                this.updateChoicePriority();
            })
        );
    }

    /** Store Criteria */
    confirmStoreCriteria(criteria: ProductCriteria) {
        const productOfCriteria = new SaleProduct();
        productOfCriteria.id = this.fetchProductId;
        criteria.product = productOfCriteria;
        let producteCriteriaObs: Observable<ProductCriteria>;
        producteCriteriaObs = this.productCriteriaService.saveCriterionOfProduct(
            criteria
        );
        producteCriteriaObs.subscribe(
            (restData) => {
                criteria.editable = false;
                criteria.actionStore = false;
                criteria.id = restData.id;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Service maket',
                    detail: 'Critére ajouté avec succès',
                    life: 6000,
                });
            },
            (errRes) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Service market',
                    detail: 'Probléme d\'ajout de critére',
                    life: 6000,
                });
            }
        );
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
        this.deleteCriteriaByIndex(criteria.index);
        criteria.actionStore = false;
    }

    public deleteCriteriaByIndex(index: number) {
        for (let _i = 0; _i < this.currentCriterion.length; _i++) {
            if (this.currentCriterion[_i].index === index) {
                this.currentCriterion.splice(_i, 1);
            }
        }
    }

    /** Edit Criteria */

    confirmUpdateCriteria(criteria: ProductCriteria) {
        let productCriteriaObs: Observable<ProductCriteria>;
        productCriteriaObs = this.productCriteriaService.updateCriterionOfProduct(
            criteria
        );
        productCriteriaObs.subscribe(
            (restData) => {
                criteria.editable = false;
                criteria.actionEdit = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Service maket',
                    detail: 'Critére mis à jour avec succès',
                    life: 6000,
                });
            },
            (errRes) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Service market',
                    detail: 'Probléme de mise à jour de critére',
                    life: 6000,
                });
            }
        );
    }
    enableEditModeCriteria(criteria: ProductCriteria) {
        criteria.editable = true;
        criteria.actionEdit = true;
    }

    disabelEditModeCriteria(criteria: ProductCriteria) {
        criteria.editable = false;
        criteria.actionEdit = false;
    }

    /** Delete criteria */
    confirmDeleteCriteria(criteria: ProductCriteria) {
        this.productCriteriaToDelete = criteria;
        this.display = true;
    }

    onDeleteCriteria() {
        this.display = false;
        let deleteObs: Observable<ProductCriteria>;
        deleteObs = this.productCriteriaService.deleteProductCriteria(
            this.productCriteriaToDelete.id
        );
        deleteObs.subscribe(
            (deleteProductCriteria) => {
                this.deleteCriteriaById(deleteProductCriteria.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Service maket',
                    detail: 'Critére supprimé avec succès',
                    life: 6000
                });
            },
            (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Service market',
                    detail: 'Probléme de suppression de Critére',
                    life: 6000
                });
            }
        );
    }
    public deleteCriteriaById(id: number) {
        for (let _i = 0; _i < this.currentCriterion.length; _i++) {
            if (this.currentCriterion[_i].id === id) {
                this.currentCriterion.splice(_i, 1);
            }
        }
    }

    /** Update Choice Criteria */

    enableEditModeChoiceCriteria(productChoiceCriteria: ProductChoiceCriteria) {
        productChoiceCriteria.editable = true;
        productChoiceCriteria.actionEdit = true;
        productChoiceCriteria.actionStore = false;
    }

    confirmUpdateChoiceCriteria(
        productChoiceCriteria: ProductChoiceCriteria,
        productCriteria: ProductCriteria
    ) {
        this.confirmStoreCriteria(productCriteria);
        productChoiceCriteria.editable = false;
        productChoiceCriteria.actionEdit = false;
    }

    disabelEditModeChoiceCriteria(productChoiceCriteria: ProductChoiceCriteria) {
        productChoiceCriteria.editable = false;
        productChoiceCriteria.actionEdit = false;
    }

    /** Store choice criteria */
    confirmStoreChoiceCriteria(
        productChoiceCriteria: ProductChoiceCriteria,
        productCriteria: ProductCriteria
    ) {
        this.confirmStoreCriteria(productCriteria);
        productChoiceCriteria.editable = false;
        productChoiceCriteria.actionStore = false;
    }

    addChoice(choiceCriterion: ProductChoiceCriteria[]) {
        const choiceCriteria = new ProductChoiceCriteria();
        choiceCriteria.label = '';
        choiceCriteria.editable = true;
        choiceCriteria.actionStore = true;
        choiceCriteria.index = this.indexChoice++;
        choiceCriterion.unshift(choiceCriteria);
    }

    ignoreStoreChoiceCriteria(
        productChoiceCriteria: ProductChoiceCriteria,
        choiceCriterion: ProductChoiceCriteria[]
    ) {
        this.deleteChoiceCriteriaByIndex(productChoiceCriteria.index, choiceCriterion);
        productChoiceCriteria.actionStore = false;
    }

    public deleteChoiceCriteriaByIndex(
        index: number,
        choiceCriterion: ProductChoiceCriteria[]
    ) {
        for (let _i = 0; _i < choiceCriterion.length; _i++) {
            if (choiceCriterion[_i].index === index) {
                choiceCriterion.splice(_i, 1);
            }
        }
    }
    /** Delete Choice */
    confirmDeleteChoiceCriteria(choiceCriterion: ProductChoiceCriteria[], productChoiceCriteria: ProductChoiceCriteria) {
        this.productChoicesCriteriaToDelete = choiceCriterion;
        this.productChoiceCriteriaToDelete = productChoiceCriteria;
        this.displayChoice = true;
    }
    onDeleteChoieCriteria() {
        this.displayChoice = false;
        let deleteObs: Observable<ProductCriteria>;
        deleteObs = this.productCriteriaService.deleteChoiceCriteria(
            this.productChoiceCriteriaToDelete.id
        );
        deleteObs.subscribe(
            (deleteProductCriteria) => {
                this.deleteChoiceCriteriaById(deleteProductCriteria.id, this.productChoicesCriteriaToDelete);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Service maket',
                    detail: 'Choix supprimé avec succès',
                    life: 6000
                });
            },
            (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Service market',
                    detail: 'Probléme de suppression de choix',
                    life: 6000
                });
            }
        );
    }
    public deleteChoiceCriteriaById(
        id: number,
        choiceCriterion: ProductChoiceCriteria[]
    ) {
        for (let _i = 0; _i < choiceCriterion.length; _i++) {
            if (choiceCriterion[_i].id === id) {
                choiceCriterion.splice(_i, 1);
            }
        }
    }
    updateOtherCriteria() {
        this.updateChoicePriority();
    }

    haveAlreadyChoicePriority() {
        for (const criteria of this.currentCriterion) {
            if (
                criteria.choiceCriterion != null &&
                criteria.choicePriority === true
            ) {
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

    goProductsManage() {
        this.router.navigate(['/administrator/market/sale-products-manage'], {
            queryParams: {
                saleId: this.fetchSaleId,
                parentId: this.fetchParentId,
                nodeOfSale: this.fetchIsSale,
            },
        });
    }

    /** Tools */
    private generateTableColsChoiceCriterai() {
        this.colsTableColsChoiceCriterai = [
            { field: 'label', header: 'Libellé' },
            { field: 'description', header: 'Description' },
            { field: 'quantity', header: 'Quantité' },
        ];
    }

    private generateContextMenu() {
        this.itemsContextMenu = [
            {
                label: 'Critére Simple',
                command: () => {
                    this.addCriteria();
                },
            },
            {
                label: 'Critére Liste',
                command: () => {
                    this.addChoiceCriteria();
                },
            },
        ];
    }
}
