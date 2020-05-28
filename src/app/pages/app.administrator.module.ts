import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../common/tools/material.module';
import { AppAdministratorRoutingModule } from './app.administrator.routing.module';

// Application Components
import { AppAdministratorComponent } from './app.administrator.component';
import { AppDashboardComponent } from './dashboard/app.dashboard.component';
import { AppRightPanelComponent } from '../theme/rightpanel/app.rightpanel.component';
import { AppMenuComponent } from '../theme/menu/app.menu.component';
import { AppMenuitemComponent } from '../theme/menu/app.menuitem.component';
import { AppTopBarComponent } from '../theme/topbar/app.topbar.component';
import { AppBreadcrumbComponent } from '../theme/breadcrumb/app.breadcrumb.component';

import { AppFooterComponent } from '../theme/footer/app.footer.component';
import { AppConfigComponent } from '../theme/config/app.config.component';

import { AppLodingPageComponent } from '../theme/loading/page/app.loading.page.component';

// Application services
import { BreadcrumbService } from '../theme/breadcrumb/breadcrumb.service';
import { MenuService } from '../theme/menu/app.menu.service';

@NgModule({
  declarations: [
    AppAdministratorComponent,
    AppDashboardComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppRightPanelComponent,
    AppBreadcrumbComponent,
    AppFooterComponent,
    AppConfigComponent,
    AppLodingPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    AppAdministratorRoutingModule,
    MaterialModule
  ],
  providers: [
    BreadcrumbService, MenuService
  ],
})
export class AppAdministratorModule { }
