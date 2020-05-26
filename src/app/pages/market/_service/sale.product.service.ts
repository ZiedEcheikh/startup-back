import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { RestApiService } from '../../../common';
import { AuthService } from '../../../auth/auth.service';

import { RestConfig } from '../../../common/services/rest/rest.config';
import { SaleProduct } from '../_models';


@Injectable({
    providedIn: 'root'
})
export class SaleProductService {

    constructor(private restApiService: RestApiService, private authService: AuthService) { }

    getProductsById(productId: number): Observable<SaleProduct> {
        return this.restApiService.get(RestConfig.REST_MANAGE_API_HOST, '/products/' + productId);
    }
    addSaleProduct(saleProduct: SaleProduct): Observable<SaleProduct> {
        return this.authService.userId
        .pipe(
            take(1),
            switchMap(userId => {
                if (!userId) {
                    throw new Error('No user id found !');
                }
                saleProduct.userId = userId;
                return this.restApiService.post(RestConfig.REST_MANAGE_API_HOST, '/products', saleProduct);
            })
        );
    }

    updateSaleProduct(saleProduct: SaleProduct): Observable<SaleProduct> {

        return this.authService.userId
            .pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('No user id found !');
                    }
                    saleProduct.userId = userId;
                    return this.restApiService.put(RestConfig.REST_MANAGE_API_HOST, '/products', saleProduct);
                })
            );
    }

    deleteSaleProduct(productId: number) {
        return this.restApiService.delete(RestConfig.REST_MANAGE_API_HOST, '/products/' + productId);
    }

    getProductsOfSale(saleId: number): Observable<SaleProduct[]> {
        return this.restApiService.get(RestConfig.REST_MANAGE_API_HOST, '/products/sale/' + saleId);
    }

    getProductsOfSaleDetails(saleDetailsId: number) {
        return this.restApiService.get(RestConfig.REST_MANAGE_API_HOST, '/products/sale/details/' + saleDetailsId);
    }
}
