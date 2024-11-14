import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Enrutamiento
import { HomeRoutingModule } from './home-routing.module';

// Páginas del Módulo
import { homePage } from './pages/home/home.page';

// Módulo Compartido - Componentes
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [homePage]
})
export class HomeModule { }
