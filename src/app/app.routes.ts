import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppNotfoundComponent } from './pages/common/notfound/app.notfound.component';
import { AppErrorComponent } from './pages/common/error/app.error.component';
import { AppAccessdeniedComponent } from './pages/common/accessdenied/app.accessdenied.component';
import { AuthLoadGuard } from './auth/auth.load.guard';
export const routes: Routes = [
    { path: '', redirectTo: 'administrator', pathMatch: 'full' },
    {
      path: 'auth',
      loadChildren: () => import('./auth/app.auth.module').then(m => m.AuthPageModule)
    },
    {
      path: 'administrator',
      loadChildren: () => import('./pages/app.administrator.module').then(m => m.AppAdministratorModule),
      canLoad: [AuthLoadGuard]
    },
    {path: 'error', component: AppErrorComponent},
    {path: 'accessdenied', component: AppAccessdeniedComponent},
    {path: 'notfound', component: AppNotfoundComponent},
];

export const AppRoutes:
ModuleWithProviders<RouterModule> =
RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})as ModuleWithProviders<RouterModule>;
