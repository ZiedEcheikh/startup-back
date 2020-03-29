import { Injectable} from '@angular/core';
import {
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuthenticated => {

        if (!isAuthenticated) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
