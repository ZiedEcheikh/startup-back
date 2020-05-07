import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NodeTreeSaleDetails } from '../_models';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(private router: Router) {

    }
    getItemsNewSaleSteps() {

    }

    getItemTreeMenu(node: NodeTreeSaleDetails) {

        if (node.detailsProducts) {
            return this.getItemsShowProducts();
        }

        if (node.children == null || node.children.length === 0) {
            return this.getItemsManageSaleDetailsOrProducts();
        }
        if (node.detailsWithProducts) {
            return this.getItemsManageSaleDetailsProducts();
        }

        if (!node.detailsWithProducts) {
            return this.getItemsManageSaleDetails();
        }
    }

    getItemsManageSaleDetailsOrProducts() {
        let menus: MenuItem[] = [];
        return menus = [
            {
                label: 'Ajouter',
                items: [{
                    label: 'Groupe Details', command: (event: Event) => { this.goSaleDetailsManage(1); }
                },
                { label: 'Produits', command: (event: Event) => { this.goProductsManage(1); } }
                ]
            },
            { label: 'Quit' }
        ];
    }

    getItemsManageSaleDetails() {
        let menus: MenuItem[] = [];
        return menus = [
            {
                label: 'Ajouter',
                items: [{
                    label: 'Groupe Details', command: (event: Event) => { this.goSaleDetailsManage(1); }
                }
                ]
            },
            { label: 'Quit' }
        ];
    }

    getItemsManageSaleDetailsProducts() {
        let menus: MenuItem[] = [];
        return menus = [
            {
                label: 'Ajouter',
                items: [
                    { label: 'Produits', command: (event: Event) => { this.goProductsManage(1); } }
                ]
            },
            { label: 'Quit' }
        ];
    }
    getItemsShowProducts() {
        let menus: MenuItem[] = [];
        return menus = [
            {
                label: 'Afficher Produits', command: (event: Event) => { this.goProductsManage(1); }
            },
            { label: 'Quit' }
        ];
    }

    goSaleDetailsManage(idDetails: number) {
        this.router.navigate(['/administrator/market/sale-details-manage'], { queryParams: { saleId: idDetails } });
    }
    goProductsManage(idDetails: number) {
        this.router.navigate(['/administrator/market/sale-products-manage'], { queryParams: { saleId: idDetails } });
    }
}
