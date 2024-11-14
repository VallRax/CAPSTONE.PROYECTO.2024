import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa las páginas del módulo de autenticación
import { loginPage } from './pages/login/login.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { WelcomePage } from './pages/welcome/welcome.page';

const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomePage
  },
  {
    path: 'login',
    component: loginPage
  },
  {
    path: 'sign-up',
    component: SignUpPage
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPage
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
