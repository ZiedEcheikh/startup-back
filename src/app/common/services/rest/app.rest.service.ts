/**
 * @author  Zied ECHEIKH
 * @since   18/12/2017
 * @version 1.0
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RestApiService {

    private Http: HttpClient;

    constructor(Http: HttpClient) {
        this.Http = Http;
    }

    private _createAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();

        /*if(this.userService.user) {
            headers.set('Authorization', this.identityService.user.token);
        }*/

        return headers;
    }

    public get(urlRoot: string, url: string) {
        return this.Http.get<any>(urlRoot + url);
    }

    public post(urlRoot: string, url: string, body: object) {
        return this.Http.post<any>(urlRoot + url, body);
    }

    public put(urlRoot: string, url: string, body: object) {
        return this.Http.put(urlRoot + url, body);
    }

    public delete(urlRoot: string, url: string) {
        return this.Http.delete(urlRoot + url);
    }
}
