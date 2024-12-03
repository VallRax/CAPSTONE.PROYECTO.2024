import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from 'src/app/core/guards/no-auth.guard';

import { loginPage } from './pages/login/login.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { WelcomePage } from './pages/welcome/welcome.page';

const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomePage,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'login',
    component: loginPage,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'sign-up',
    component: SignUpPage,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPage,
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
