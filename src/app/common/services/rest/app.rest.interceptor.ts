import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { AuthService } from '../../../auth/auth.service';

@Injectable()
export class AuthHelpers implements HttpInterceptor {
    constructor(private authService: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.token.pipe(
            take(1),
            switchMap(token => {
                if (token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization:  `Bearer ${token}`
                        }
                    });
                }
                return next.handle(request);
            })
        );
    }
}
