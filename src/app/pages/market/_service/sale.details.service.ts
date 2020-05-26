import { Injectable } from '@angular/core';

import { RestApiService } from '../../../common';
import { RestConfig } from '../../../common/services/rest/rest.config';

import { SaleDetails, Sale, NodeTreeSaleDetails, SaleProduct } from '../_models';

@Injectable({
    providedIn: 'root'
})
export class SaleDetailsService {
    constructor(private restApiService: RestApiService) { }

    getSaleDetailsById(idDetails: number) {
        return this.restApiService.get(RestConfig.REST_MANAGE_API_HOST, '/details/' + idDetails);
    }

    addSaleDetails(saleDetails: SaleDetails) {
        return this.restApiService.post(RestConfig.REST_MANAGE_API_HOST, '/details/', saleDetails);
    }

    deleteSaleDetails(idDetails: number) {
        return this.restApiService.delete(RestConfig.REST_MANAGE_API_HOST, '/details/' + idDetails);
    }

    updateSaleDetails(saleDetails: SaleDetails) {
        return this.restApiService.put(RestConfig.REST_MANAGE_API_HOST, '/details/', saleDetails);
    }

    getSaleDetailsBySaleId(saleId: number) {
        return this.restApiService.get(RestConfig.REST_MANAGE_API_HOST, '/details/sale/' + saleId);
    }

    generateTreeForSale(sale: Sale, saleDetails: SaleDetails[]) {
        const saleDetailsTree: NodeTreeSaleDetails[] = [];
        const nodeOfSale = new NodeTreeSaleDetails();
        nodeOfSale.id = sale.id;
        nodeOfSale.label = sale.label;
        nodeOfSale.descritpion = sale.description;
        nodeOfSale.isNodeOfSale = true;
        nodeOfSale.children = [];
        saleDetailsTree.push(nodeOfSale);
        for (let i = 0; i < saleDetails.length; i++) {
            nodeOfSale.children[i] = saleDetails[i];
        }
        return saleDetailsTree;
    }

    generateTreeForSaleWithOnlyProducts(sale: Sale, productsDetails: SaleProduct[]) {
        const saleDetailsTree: NodeTreeSaleDetails[] = [];
        const nodeOfSale = new NodeTreeSaleDetails();
        nodeOfSale.id = sale.id;
        nodeOfSale.label = sale.label;
        nodeOfSale.descritpion = sale.description;
        nodeOfSale.isNodeOfSale = true;
        nodeOfSale.detailsWithProducts = true;
        nodeOfSale.children = [];
        saleDetailsTree.push(nodeOfSale);
        const nodeProductSale = new NodeTreeSaleDetails();
        nodeProductSale.id = sale.id;
        nodeProductSale.label = productsDetails.length + ' produits';
        nodeProductSale.detailsProducts = true;
        nodeProductSale.isNodeOfSale = true;
        nodeOfSale.children.push(nodeProductSale);
        return saleDetailsTree;
    }
}
