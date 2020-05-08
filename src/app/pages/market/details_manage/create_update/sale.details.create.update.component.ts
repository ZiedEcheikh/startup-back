import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';

import { SaleDetailsService, MenuService, SaleService } from '../../_service';
import { Router, ActivatedRoute } from '@angular/router';
import { take, switchMap, tap } from 'rxjs/operators';
import { Sale } from '../../_models';
import { SaleDetails } from '../../_models/sale.details.model';
import { ErrorCode } from 'src/app/common';
import { Observable, of } from 'rxjs';
import { LoadingPageService } from 'src/app/theme';


@Component({
    selector: 'app-sale',
    templateUrl: './sale.details.create.update.component.html',
    styleUrls: ['./sale.details.create.update.component.scss']
})

export class SaleDetailsCreateUpdateComponent implements OnInit {
    stepsItems: MenuItem[];
    cols: any[];
    isSale = false;
    parentId: number;
    currentSale: Sale;
    selectedSaleDetail: Sale;
    currentSaleDetails: SaleDetails;
    listDetails: SaleDetails[];
    parentSaleDetails: SaleDetails;
    saleDetailsToUpdate: SaleDetails;
    fetchSaleId: number;
    detailsToUpdateId: number;
    label: string;
    description: string;
    constructor(private saleService: SaleService, private saleDetailsService: SaleDetailsService, private menuService: MenuService,
        private route: ActivatedRoute, private router: Router, private loadingPageService: LoadingPageService) {
        this.stepsItems = this.menuService.getItemsNewSaleSteps();

        this.cols = [
            { field: 'label', header: 'Labelle' },
            { field: 'description', header: 'Description' }
        ];
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
                this.detailsToUpdateId = params.detailsId;
                this.isSale = Boolean(JSON.parse(params.nodeOfSale));
                return this.saleService.getSale(this.fetchSaleId);
            }),
            take(1),
            switchMap(sale => {
                this.currentSale = sale;
                // TODO : error retrieve sale
                return this.saleDetailsService.getSaleDetailsById(this.parentId);
            }),
            take(1),
            switchMap(parentSaleDetails => {
                this.parentSaleDetails = parentSaleDetails;
                // TODO : error retrieve sale details
                if (this.detailsToUpdateId != null) {
                    return this.saleDetailsService.getSaleDetailsById(this.detailsToUpdateId);
                } else {
                    return of(null);
                }
            }),
            take(1),
            tap(saleDetailsToUpdate => {
                this.saleDetailsToUpdate = saleDetailsToUpdate;
                this.label = saleDetailsToUpdate.label;
                this.description = saleDetailsToUpdate.description;
            })
        );
    }

    saveSaleDetails(saleDetails: SaleDetails) {
        this.loadingPageService.present();
        let saleObs: Observable<Sale>;
        saleObs = this.saleDetailsService.addSaleDetails(saleDetails);
        saleObs.subscribe(restData => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
            this.goSaleDetailsManage();
            console.log(restData);
        }, errRes => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
            console.log(errRes);
        });
    }

    updateSaleDetails(saleDetails: SaleDetails) {
        this.loadingPageService.present();
        let saleObs: Observable<Sale>;
        saleObs = this.saleDetailsService.updateSaleDetails(saleDetails);
        saleObs.subscribe(restData => {
            setTimeout(() => this.loadingPageService.dismiss(), 2000);
            this.goSaleDetailsManage();
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
        const saleDetailsToSave = new SaleDetails();
        saleDetailsToSave.label = label;
        saleDetailsToSave.description = description;
        if (this.isSale) {
            const sale = new Sale().buildSaleWithId(this.currentSale.id);
            saleDetailsToSave.sale = sale;
        } else {
            const parentSaleDetail = new SaleDetails();
            parentSaleDetail.id = this.parentSaleDetails.id;
            saleDetailsToSave.parent = parentSaleDetail;
        }
        // TODO parent sale id
        if (this.detailsToUpdateId != null) {
            saleDetailsToSave.id = this.saleDetailsToUpdate.id;
            this.updateSaleDetails(saleDetailsToSave);
        } else {
            this.saveSaleDetails(saleDetailsToSave);
        }
        form.reset();
    }


    goNext() {
        this.router.navigate(['/administrator/market/sale-recap'], { queryParams: { saleId: this.fetchSaleId } });
    }
    goBack() {
        this.goSaleDetailsManage();
    }
    goSaleDetailsManage() {
        this.router.navigate(['/administrator/market/sale-details-manage'],
            { queryParams: { saleId: this.fetchSaleId, parentId: this.parentId, nodeOfSale: this.isSale } });
    }
}
