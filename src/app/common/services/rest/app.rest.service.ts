/**
 * @author  Zied ECHEIKH
 * @since   18/12/2017
 * @version 1.0
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestConfig } from './rest.config';

@Injectable()
export class RestApiService {

    private Http: HttpClient;
    private urlRoot: String;

    constructor(Http: HttpClient) {
        this.Http = Http;
        this.urlRoot = RestConfig.REST_API_HOST;
    }

    private _createAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();

        /*if(this.userService.user) {
            headers.set('Authorization', this.identityService.user.token);
        }*/

        return headers;
    }

    public get(url: string) {
        return this.Http.get(this.urlRoot + url);
    }

    public post(url: string, body: Object) {
        return this.Http.post<any>(this.urlRoot + url, body);
    }

    public put(url: string, body: Object) {
        return this.Http.put(this.urlRoot + url, body);
    }

    public delete(url: string) {
        return this.Http.delete(this.urlRoot + url);
    }
}
