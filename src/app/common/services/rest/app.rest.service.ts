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
    public get(urlRoot: string, url: string) {
        return this.Http.get<any>(urlRoot + url);
    }

    public post(urlRoot: string, url: string, body: object) {
        return this.Http.post<any>(urlRoot + url, body);
    }

    public put(urlRoot: string, url: string, body: object) {
        return this.Http.put<any>(urlRoot + url, body);
    }

    public delete(urlRoot: string, url: string) {
        return this.Http.delete<any>(urlRoot + url);
    }
}
