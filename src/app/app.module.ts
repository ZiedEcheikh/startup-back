import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import {AppRoutes} from './app.routes';

import { MessageService } from 'primeng/api';

// Application Components
import {AppComponent} from './app.component';
import {AppNotfoundComponent} from './pages/common/notfound/app.notfound.component';
import {AppErrorComponent} from './pages/common/error/app.error.component';
import {AppAccessdeniedComponent} from './pages/common/accessdenied/app.accessdenied.component';
import {AppLodingComponent} from './theme/loading/app.loading.component';
import {LoadingService} from './theme/loading/app.loading.service';
import { ServicesModule } from './common/services/services.module';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutes,
        BrowserAnimationsModule,
        ServicesModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AppLodingComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}, LoadingService, MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
