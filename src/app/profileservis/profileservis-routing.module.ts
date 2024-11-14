import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileservisPage } from './profileservis.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileservisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileservisPageRoutingModule {}
