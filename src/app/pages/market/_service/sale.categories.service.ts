import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestApiService } from '../../../common';
import { SaleCategory } from '../_models';
import { RestConfig } from '../../../common/services/rest/rest.config';

@Injectable({
    providedIn: 'root'
})
export class SaleCategoriesService {

    constructor(private restApiService: RestApiService) { }

    getAllSaleCategories(): Observable<SaleCategory[]> {
        return this.restApiService.get(RestConfig.REST_MANAGE_API_HOST, '/categories');
    }
}
