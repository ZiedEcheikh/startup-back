import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPictureData } from '../_models';
import { RestApiService } from '../../../common';
import { RestConfig } from '../../../common/services/rest/rest.config';

import { AuthService } from '../../../auth/auth.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductPictureService {

    constructor(private restApiService: RestApiService, private authService: AuthService) { }

    uploadProductPicture(image: File, pictureRank: number, productId: number): Observable<ProductPictureData> {
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
                        '/product/pictures/upload?productId=' + productId
                        + '&pictureRank=' + pictureRank
                        + '&userId=' + userId, uploadData);
                })
            );
    }

    getProductPictures(productId: number): Observable<ProductPictureData[]> {
        return this.restApiService.get(RestConfig.REST_FILES_API_HOST, '/product/pictures/' + productId);
    }

    deleteProductPicture(productId: number): Observable<ProductPictureData> {
        return this.restApiService.delete(RestConfig.REST_FILES_API_HOST, '/product/pictures/' + productId);
    }
}
