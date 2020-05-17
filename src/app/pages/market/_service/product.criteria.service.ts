import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { RestApiService } from '../../../common';
import { AuthService } from '../../../auth/auth.service';

import { RestConfig } from '../../../common/services/rest/rest.config';
import { ProductCriteria } from '../_models';


@Injectable({
    providedIn: 'root'
})
export class ProductCriteriaService {

    constructor(private restApiService: RestApiService, private authService: AuthService) { }

    getCriterionOfProduct(productId: number): Observable<ProductCriteria[]> {
        return this.restApiService.get(RestConfig.REST_MANAGE_API_HOST, '/product/criterion/products/' + productId);
    }

    saveCriterionOfProduct(productCriteria: ProductCriteria): Observable<ProductCriteria> {
        return this.authService.userId
            .pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('No user id found !');
                    }
                    productCriteria.userId = userId;
                    return this.restApiService.post(RestConfig.REST_MANAGE_API_HOST, '/product/criterion', productCriteria);
                })
            );
    }

    updateCriterionOfProduct(productCriteria: ProductCriteria): Observable<ProductCriteria> {
        return this.authService.userId
            .pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('No user id found !');
                    }
                    productCriteria.userId = userId;
                    return this.restApiService.put(RestConfig.REST_MANAGE_API_HOST, '/product/criterion', productCriteria);
                })
            );
    }

    deleteProductCriteria(productCriteriaId: number) {
        return this.restApiService.delete(RestConfig.REST_MANAGE_API_HOST, '/product/criterion/' + productCriteriaId);
    }

    deleteChoiceCriteria(choiceCriteriaId: number) {
        return this.restApiService.delete(RestConfig.REST_MANAGE_API_HOST, '/product/criterion/choice/' + choiceCriteriaId);
    }

}
