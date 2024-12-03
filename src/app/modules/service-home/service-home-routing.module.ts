import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { RoleGuard } from 'src/app/core/guards/role.guard';

import { ServiceHomePage } from './pages/service-home/service-home.page';
import { AddServicePage } from './pages/add-service/add-service.page';
import { EditServicePage } from './pages/edit-service/edit-service.page';
import { AddOfferPage } from './pages/add-offer/add-offer.page';
import { EditOfferPage } from './pages/edit-offer/edit-offer.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceHomePage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service'] },
  },
  {
    path: 'add-service',
    component: AddServicePage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service'] },
  },
  {
    path: 'edit-service/:id',
    component: EditServicePage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service'] },
  },
  {
    path: 'add-offer/:id',
    component: AddOfferPage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service'] },
  },
  {
    path: 'edit-offer/:serviceId/:offerId',
    component: EditOfferPage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['service'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceHomeRoutingModule {}
