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
        let menus: MenuItem[] = [];
        return  menus = [
            { label: 'Vente' },
            { label: 'Affiche' },
            { label: 'Détails' },
            { label: 'Récap' }
          ];
    }

    getItemTreeMenu(node: NodeTreeSaleDetails, saleId: number) {

        if (node.detailsProducts) {
            return this.getItemsShowProducts(node, saleId);
        }

        if (node.children == null || node.children.length === 0) {
            return this.getItemsManageSaleDetailsOrProducts(node, saleId);
        }
        if (node.detailsWithProducts) {
            return this.getItemsManageSaleDetailsProducts(node, saleId);
        }

        if (!node.detailsWithProducts) {
            return this.getItemsManageSaleDetails(node, saleId);
        }
    }

    getItemsManageSaleDetailsOrProducts(node: NodeTreeSaleDetails, saleId: number) {
        let menus: MenuItem[] = [];
        return menus = [
            {
                label: 'Ajouter',
                items: [{
                    label: 'Groupe Details', command: (event: Event) => { this.goSaleDetailsManage(node, saleId); }
                },
                { label: 'Produits', command: (event: Event) => { this.goProductsManage(node, saleId); } }
                ]
            },
            { label: 'Quit' }
        ];
    }

    getItemsManageSaleDetails(node: NodeTreeSaleDetails, saleId: number) {
        let menus: MenuItem[] = [];
        return menus = [
            {
                label: 'Ajouter',
                items: [{
                    label: 'Groupe Details', command: (event: Event) => { this.goSaleDetailsManage(node, saleId); }
                }
                ]
            },
            { label: 'Quit' }
        ];
    }

    getItemsManageSaleDetailsProducts(node: NodeTreeSaleDetails, saleId: number) {
        let menus: MenuItem[] = [];
        return menus = [
            {
                label: 'Ajouter',
                items: [
                    { label: 'Produits', command: (event: Event) => { this.goProductsManage(node, saleId); } }
                ]
            },
            { label: 'Quit' }
        ];
    }
    getItemsShowProducts(node: NodeTreeSaleDetails, saleId: number) {
        let menus: MenuItem[] = [];
        return menus = [
            {
                label: 'Afficher Produits', command: (event: Event) => { this.goProductsManage(node, saleId); }
            },
            { label: 'Quit' }
        ];
    }

    goSaleDetailsManage(node: NodeTreeSaleDetails, saleId: number) {
        this.router.navigate(['/administrator/market/sale-details-manage'],
            { queryParams: {saleId, parentId: node.id, nodeOfSale: node.isNodeOfSale } });
    }
    goProductsManage(node: NodeTreeSaleDetails, saleId: number) {
        this.router.navigate(['/administrator/market/sale-products-manage'],
            {queryParams: {saleId, parentId: node.id, nodeOfSale: node.isNodeOfSale } });
    }
}
