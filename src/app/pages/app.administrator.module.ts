import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppAdministratorRoutingModule } from './app.administrator.routing.module';
import {TabViewModule} from 'primeng/tabview';
// PrimeNG Components for demos
import {CalendarModule} from 'primeng/calendar';

// Application Components
import { AppAdministratorComponent } from './app.administrator.component';
import { AppDashboardComponent } from './dashboard/app.dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {AppRightPanelComponent} from '../theme/rightpanel/app.rightpanel.component';

import {CheckboxModule} from 'primeng/checkbox';
import {BreadcrumbModule} from 'primeng/breadcrumb';

import {AppMenuComponent} from '../theme/menu/app.menu.component';
import {AppMenuitemComponent} from '../theme/menu/app.menuitem.component';
import {AppTopBarComponent} from '../theme/topbar/app.topbar.component';
import {AppBreadcrumbComponent} from '../theme/breadcrumb/app.breadcrumb.component';

import {AppFooterComponent} from '../theme/footer/app.footer.component';
import {AppConfigComponent} from '../theme/config/app.config.component';
// Application services
import {BreadcrumbService} from '../theme/breadcrumb/breadcrumb.service';
import {MenuService} from '../theme/menu/app.menu.service';

@NgModule({
  declarations: [
    AppAdministratorComponent,
    AppDashboardComponent,
    WelcomeComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppRightPanelComponent,
    AppBreadcrumbComponent,
    AppFooterComponent,
    AppConfigComponent],
  imports: [
    CommonModule,
    AppAdministratorRoutingModule,
    CalendarModule,
    CheckboxModule,
    TabViewModule,
    BreadcrumbModule
  ],
  providers: [
    BreadcrumbService, MenuService
],
})
export class AppAdministratorModule { }
