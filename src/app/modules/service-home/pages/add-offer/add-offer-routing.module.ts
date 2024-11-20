import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOfferPage } from './add-offer.page';

const routes: Routes = [
  {
    path: '',
    component: AddOfferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOfferPageRoutingModule {}
