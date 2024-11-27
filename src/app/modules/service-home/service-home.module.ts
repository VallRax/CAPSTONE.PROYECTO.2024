import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ServiceHomeRoutingModule } from './service-home-routing.module';
import { AddServicePage } from './pages/add-service/add-service.page';
import { ServiceHomePage } from './pages/service-home/service-home.page';
import { EditServicePage } from './pages/edit-service/edit-service.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddOfferPage } from './pages/add-offer/add-offer.page';
import { EditOfferPage } from './pages/edit-offer/edit-offer.page';

@NgModule({
  declarations: [
    ServiceHomePage,
    AddServicePage,
    EditServicePage,
    AddOfferPage,
    EditOfferPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ServiceHomeRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
  ]
})
export class ServiceHomeModule { }
