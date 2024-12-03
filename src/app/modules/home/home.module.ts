import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


// Enrutamiento
import { HomeRoutingModule } from './home-routing.module';

// Páginas del Módulo
import { homePage } from './pages/home/home.page';

// Módulo Compartido - Componentes
import { SharedModule } from 'src/app/shared/shared.module';
import { ServicePage } from './pages/service/service.page';
import { SchedulePage } from './pages/schedule/schedule.page';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
  ],
  declarations: [
    homePage,
    ServicePage,
    SchedulePage,
  ]
})
export class HomeModule { }
