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
import { FavoritesPage } from './pages/favorites/favorites.page';
import { ScheduledServicesPage } from './pages/scheduled-services/scheduled-services.page';
import { CategoryPage } from './pages/category/category.page';



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
    FavoritesPage,
    ScheduledServicesPage,
    CategoryPage,
  ]
})
export class HomeModule { }
