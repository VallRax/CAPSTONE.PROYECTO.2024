import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceHomePage } from './pages/service-home/service-home.page';
import { AddServicePage } from './pages/add-service/add-service.page';
import { EditServicePage } from './pages/edit-service/edit-service.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceHomePage,
  },
  {
    path: 'add',
    component: AddServicePage,
  },
  {
    path: 'edit/:id',
    component: EditServicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceHomeRoutingModule {}
