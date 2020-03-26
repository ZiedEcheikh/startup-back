import { HttpHeaders, HttpParams } from '@angular/common/http';

export class RequestOptions {
    body?: any;
    headers?: HttpHeaders;
    reportProgress?: boolean;
    responseType?: String;
    withCredentials?: boolean;
    constructor(body: any, headers: HttpHeaders) {
        this.body = body;
        this.headers = headers;
    };
}
