import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDashboardComponent } from './dashboard/app.dashboard.component';
import { AppAdministratorComponent } from './app.administrator.component';

import { AuthLoadGuard } from '../auth/auth.load.guard';
const routes: Routes = [

  {
    path: '',
    component: AppAdministratorComponent,
    children: [
      {
        path: 'market',
        loadChildren: () => import('./market/market.module').then(m => m.MarketModule),
        canLoad: [AuthLoadGuard]
      },
      { path: 'dashboard', component: AppDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppAdministratorRoutingModule { }
