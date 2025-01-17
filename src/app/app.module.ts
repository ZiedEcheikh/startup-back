import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutes} from './app.routes';

// Application Components
import {AppComponent} from './app.component';
import {AppNotfoundComponent} from './pages/common/notfound/app.notfound.component';
import {AppErrorComponent} from './pages/common/error/app.error.component';
import {AppAccessdeniedComponent} from './pages/common/accessdenied/app.accessdenied.component';

import { ServicesModule } from './common/services/services.module';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutes,
        BrowserAnimationsModule,
        ServicesModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
