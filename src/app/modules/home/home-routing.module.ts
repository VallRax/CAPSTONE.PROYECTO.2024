import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { homePage } from './pages/home/home.page';
import { ServicePage } from './pages/service/service.page';

const routes: Routes = [
  {
    path: '',
    component: homePage
  },
  {
    path: 'service/:id',
    component: ServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
