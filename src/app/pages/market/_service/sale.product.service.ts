import { Injectable } from '@angular/core';

import { SaleProduct } from '../_models';


@Injectable({
    providedIn: 'root'
})
export class SaleProductService {
    saleProductsOfParent: SaleProduct[] = new Array();

    initialize() {
        let saleD1 = new SaleProduct();
        saleD1.id = 1;
        saleD1.label = 'chemise';
        saleD1.description = 'meilleure';
        saleD1.oldPrice = 90;
        saleD1.newPrice = 70;
        let saleD2 = new SaleProduct();
        saleD2.id = 2;
        saleD2.label = 'pantalon';
        saleD2.description = 'meilleure';
        saleD2.oldPrice = 100;
        saleD2.newPrice = 50;
        this.saleProductsOfParent.push(saleD1);
        this.saleProductsOfParent.push(saleD2);
    }

    getProductsOfDetails(parentId: string) {
        this.initialize();
        return this.saleProductsOfParent;
    }
}
