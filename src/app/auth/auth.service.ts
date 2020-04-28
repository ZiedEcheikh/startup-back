import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { RestApiService, AuthResponseData } from '../common';
import { RestConfig } from './../common/services/rest/rest.config';

import { AuthData } from './AuthData';
import { User } from './user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private _user = new BehaviorSubject<User>(null);

  private activeLogoutTimer: any;

  constructor(private restApiService: RestApiService) { }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storeData => {

        if (!storeData || !storeData.value) {
          return null;
        }
        const parsedData = JSON.parse(storeData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);

        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );

        return user;
      }),

      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),

      map(user => {
        return !!user;
      })
    );
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      }));
  }


  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      }));
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      }));
  }

  login(authData: AuthData): Observable<AuthResponseData> {
    return this.restApiService.post(RestConfig.REST_AUTH_API_HOST, '/user/login', authData)
      .pipe(
        tap(this.setUserData.bind(this))
      );
  }

  logout() {

    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
  private autoLogout(duration: number) {
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expires_in * 1000));
    const user = new User(userData.userId,
      userData.email,
      userData.access_token,
      expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.userId, userData.access_token, expirationTime.toISOString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({ userId: userId, token: token, tokenExpirationDate: tokenExpirationDate, email: email });

    Plugins.Storage.set({ key: 'authData', value: data });
  }
}
