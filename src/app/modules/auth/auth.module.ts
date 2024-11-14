import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Enrutamiento
import { AuthRoutingModule } from './auth-routing.module';

// Páginas del Módulo
import { loginPage } from './pages/login/login.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { WelcomePage } from './pages/welcome/welcome.page';

// Módulo Compartido - Componentes
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    loginPage,
    SignUpPage,
    ForgotPasswordPage,
    WelcomePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AuthModule { }
