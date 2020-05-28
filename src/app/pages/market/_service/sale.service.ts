import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { RestApiService } from '../../../common';
import { RestConfig } from '../../../common/services/rest/rest.config';

import { AuthService } from '../../../auth/auth.service';

import { Sale } from '../_models/sale.model';

@Injectable({
    providedIn: 'root',
})
export class SaleService {
    constructor(
        private restApiService: RestApiService,
        private authService: AuthService
    ) { }

    addSale(sale: Sale): Observable<Sale> {
        return this.authService.userId.pipe(
            take(1),
            switchMap((userId) => {
                if (!userId) {
                    throw new Error('No user id found !');
                }
                sale.userId = userId;
                return this.restApiService.post(
                    RestConfig.REST_MANAGE_API_HOST,
                    '/sales',
                    sale
                );
            })
        );
    }

    updateSale(sale: Sale): Observable<Sale> {
        return this.authService.userId.pipe(
            take(1),
            switchMap((userId) => {
                if (!userId) {
                    throw new Error('No user id found !');
                }
                sale.userId = userId;
                return this.restApiService.put(
                    RestConfig.REST_MANAGE_API_HOST,
                    '/sales',
                    sale
                );
            })
        );
    }

    getSale(saleId: number): Observable<Sale> {
        return this.restApiService.get(
            RestConfig.REST_MANAGE_API_HOST,
            '/sales/' + saleId
        );
    }

    validateSale(sale: Sale): Observable<Sale> {
        return this.restApiService.put(
            RestConfig.REST_MANAGE_API_HOST,
            '/sales/validate', sale
        );
    }

    getSalesInProgress(): Observable<Sale[]> {
        return this.restApiService.get(
            RestConfig.REST_MANAGE_API_HOST,
            '/sales/progress'
        );
    }

    getSalesComeUp(): Observable<Sale[]> {
        return this.restApiService.get(
            RestConfig.REST_MANAGE_API_HOST,
            '/sales/comeup'
        );
    }

    getSalesOver(): Observable<Sale[]> {
        return this.restApiService.get(
            RestConfig.REST_MANAGE_API_HOST,
            '/sales/over'
        );
    }

    getSalesDisable(): Observable<Sale[]> {
        return this.restApiService.get(
            RestConfig.REST_MANAGE_API_HOST,
            '/sales/disable'
        );
    }
    getSalesDraft(): Observable<Sale[]> {
        return this.restApiService.get(
            RestConfig.REST_MANAGE_API_HOST,
            '/sales/draft'
        );
    }
}
