import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceHomePage } from './service-home.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceHomePageRoutingModule {}
