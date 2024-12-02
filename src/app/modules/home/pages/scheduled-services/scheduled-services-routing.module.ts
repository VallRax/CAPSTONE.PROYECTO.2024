import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduledServicesPage } from './scheduled-services.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduledServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduledServicesPageRoutingModule {}
