import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicePage } from './service.page';

const routes: Routes = [
  {
    path: '',
    component: ServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicePageRoutingModule {}
