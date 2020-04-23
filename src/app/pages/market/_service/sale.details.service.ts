import { Injectable } from '@angular/core';
import { SaleDetails } from '../_models';
@Injectable({
    providedIn: 'root'
})
export class SaleDetailsService {

    saleDetalisOfParent: SaleDetails[] = new Array();

    initialize(){
        let saleD1 = new SaleDetails();
        saleD1.id = 1;
        saleD1.label = 'Homme';
        saleD1.descritpion = 'description de la categorie homme';

        let saleD2 = new SaleDetails();
        saleD2.id=2;
        saleD2.label = 'Femme';
        saleD2.descritpion = 'description de la categorie femme';
        this.saleDetalisOfParent.push(saleD1);
        this.saleDetalisOfParent.push(saleD2);
    }
    getSaleDetailsOfParent(parentId: string) {
        this.initialize();
        return this.saleDetalisOfParent;
    }
}
