import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppAuthComponent} from './app.auth.component';

const routes: Routes = [
  {
    path: '',
    component: AppAuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppAuthRoutingModule {}
