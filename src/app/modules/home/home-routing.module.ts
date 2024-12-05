import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { RoleGuard } from 'src/app/core/guards/role.guard';

import { homePage } from './pages/home/home.page';
import { ServicePage } from './pages/service/service.page';
import { SchedulePage } from './pages/schedule/schedule.page';
import { FavoritesPage } from './pages/favorites/favorites.page';
import { ScheduledServicesPage } from './pages/scheduled-services/scheduled-services.page';
import { CategoryPage } from './pages/category/category.page';

const routes: Routes = [
  {
    path: '',
    component: homePage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['client'] },
  },
  {
    path: 'service/:id',
    component: ServicePage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['client'] },
  },
  {
    path: 'schedule/:serviceId/:offerId',
    component: SchedulePage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['client'] },
  },
  {
    path: 'favorites',
    component: FavoritesPage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['client'] },
  },
  {
    path: 'scheduled-services',
    component: ScheduledServicesPage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['client'] },
  },
  {
    path: 'category',
    component: CategoryPage,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['client'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
