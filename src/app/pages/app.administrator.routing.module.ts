import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDashboardComponent } from './dashboard/app.dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppAdministratorComponent } from './app.administrator.component';
const routes: Routes = [

  {
    path: '',
    component: AppAdministratorComponent,
    children: [
      { path: 'dashboard', component: AppDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppAdministratorRoutingModule { }
