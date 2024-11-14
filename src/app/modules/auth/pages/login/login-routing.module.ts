import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { loginPage } from './login.page';



const routes: Routes = [
  {
    path: '',
    component: loginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
