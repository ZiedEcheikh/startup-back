import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalePosterData } from '../_models';
import { RestApiService } from '../../../common';
import { RestConfig } from '../../../common/services/rest/rest.config';

import { AuthService } from '../../../auth/auth.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SalePosterService {

    constructor(private restApiService: RestApiService, private authService: AuthService) { }

    uploadPosterSale(image: File, saleId: string): Observable<SalePosterData> {
        return this.authService.userId
            .pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('No user id found !');
                    }
                    const uploadData = new FormData();
                    uploadData.append('file', image);
                    return this.restApiService.post(RestConfig.REST_FILES_API_HOST,
                        '/file/upload/sale?saleId=' + saleId + '&userId=' + userId, uploadData);
                })
            );
    }

    getPosterOfSale( saleId: string): Observable<SalePosterData> {
        return this.restApiService.get(RestConfig.REST_FILES_API_HOST, '/file/sale/' + saleId);
    }
}
