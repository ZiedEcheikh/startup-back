import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../_models/sale.model';
import { RestApiService } from '../../../common';
import { RestConfig } from '../../../common/services/rest/rest.config';

import { AuthService } from '../../../auth/auth.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SaleService {

    constructor(private restApiService: RestApiService, private authService: AuthService) { }

    addSale(sale: Sale): Observable<Sale> {

        return this.authService.userId
            .pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('No user id found !');
                    }
                    sale.userId = userId;
                    return this.restApiService.post(RestConfig.REST_MANAGE_API_HOST, '/sales', sale);
                })
            );
    }

    getSale(saleId: string): Observable<Sale> {
        return this.restApiService.get(RestConfig.REST_MANAGE_API_HOST, '/sales/' + saleId);
    }
}
