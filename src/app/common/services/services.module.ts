import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RestApiService } from './rest/app.rest.service';

import { AuthHelpers } from './rest/app.rest.interceptor';
const START_UP_SERVICES = [
  RestApiService
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders<ServicesModule> {
    return {
      ngModule: ServicesModule,
      providers: [
        ...START_UP_SERVICES,
        { provide: HTTP_INTERCEPTORS, useClass: AuthHelpers, multi: true },
      ],
    } as ModuleWithProviders<ServicesModule>;
  }
}
