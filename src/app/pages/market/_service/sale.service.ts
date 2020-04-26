import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../_models/sale.model';
import { RestApiService } from '../../../common';
import { RestConfig } from '../../../common/services/rest/rest.config';
@Injectable({
    providedIn: 'root'
})
export class SaleService {

    constructor(private restApiService: RestApiService) { }

    addSale(sale: Sale): Observable<Sale> {
        return this.restApiService.post(RestConfig.REST_MANAGE_API_HOST, '/sales', sale);
    }
}
