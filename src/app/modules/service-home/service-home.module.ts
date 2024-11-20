import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ServiceHomeRoutingModule } from './service-home-routing.module';
import { AddServicePage } from './pages/add-service/add-service.page';
import { ServiceHomePage } from './pages/service-home/service-home.page';
import { EditServicePage } from './pages/edit-service/edit-service.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ServiceHomePage,
    AddServicePage,
    EditServicePage,
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
