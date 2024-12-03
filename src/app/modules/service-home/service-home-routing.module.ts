import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceHomePage } from './pages/service-home/service-home.page';
import { AddServicePage } from './pages/add-service/add-service.page';
import { EditServicePage } from './pages/edit-service/edit-service.page';
import { AddOfferPage } from './pages/add-offer/add-offer.page';
import { EditOfferPage } from './pages/edit-offer/edit-offer.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceHomePage,
  },
  {
    path: 'add-service',
    component: AddServicePage,
  },
  {
    path: 'edit-service/:id',
    component: EditServicePage,
  },
  {
    path: 'add-offer/:id',
    component: AddOfferPage,
  },
  {
    path: 'edit-offer/:serviceId/:offerId',
    component: EditOfferPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceHomeRoutingModule {}
