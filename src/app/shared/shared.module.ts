import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceModalComponent } from './components/service-modal/service-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    BottomNavComponent,
    CustomInputComponent,
    LogoComponent,
    ServiceModalComponent,
  ],
  exports:[
    HeaderComponent,
    BottomNavComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    ServiceModalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
