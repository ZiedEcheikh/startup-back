import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import {LoadingService} from '../theme/loading/app.loading.service';
import { AuthService } from './auth.service';

import { AuthData } from './AuthData';
import { AuthResponseData } from '../common';
@Component({
  selector: 'app-auth',
  templateUrl: './app.auth.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.auth.page.scss']
})
export class AppAuthComponent  implements OnInit {

  dark: boolean;

  checked: boolean;

  isLoading = false;

  msgs: Message[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private service: MessageService
  ) { }


  ngOnInit(): void {
    setTimeout(() =>  this.loadingService.dismiss(), 2000);
  }

  onLogin(authData: AuthData) {
    this.isLoading = true;
    this.loadingService.present();
    let authObs: Observable<AuthResponseData>;
    authObs = this.authService.login(authData);
    authObs.subscribe(restData => {
      console.log(restData);
      this.isLoading = false;
      this.router.navigateByUrl('administrator/dashboard');
      setTimeout(() =>  this.loadingService.dismiss(), 2000);
    }, errRes => {
      setTimeout(() =>  this.loadingService.dismiss(), 2000);
      const code = errRes.error.message;
      let message = 'Could not sign you up, please try again.';
      if (code === 'EMAIL_EXISTS') {
        message = 'This email address exists already!';
      } else if (code === 'EMAIL_NOT_FOUND') {
        message = 'E-Mail address could not be found.';
      } else if (code === 'INVALID_PASSWORD') {
        message = 'This password is not correct.';
      }
      this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Connexion failed'});
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.identifiant;
    const password = form.value.password;
    const authData = new AuthData(email, password);
    this.onLogin(authData);
    form.reset();
  }
}
