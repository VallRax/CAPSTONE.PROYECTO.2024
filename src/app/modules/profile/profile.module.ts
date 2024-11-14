import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Enrutamiento
import { ProfileRoutingModule } from './profile-routing.module';

// Páginas del Módulo
import { ProfilePage } from './pages/profile/profile.page';

// Módulo Compartido - Componentes
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    IonicModule,
    SharedModule
  ]
})
export class ProfileModule { }
