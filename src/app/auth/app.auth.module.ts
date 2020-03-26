import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import { AppAuthRoutingModule } from './app.auth.routing.module';
import { AppAuthComponent } from './app.auth.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AppAuthRoutingModule,
    ButtonModule,
    PasswordModule,
    CheckboxModule,
    InputTextModule,
  ],
  declarations: [AppAuthComponent]
})
export class AuthPageModule { }