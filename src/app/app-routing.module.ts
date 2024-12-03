import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
    data: { roles: ['client'] }, // Rutas para clientes
  },
  {
    path: 'service-home',
    loadChildren: () =>
      import('./modules/service-home/service-home.module').then(
        (m) => m.ServiceHomeModule
      ),
    canActivate: [AuthGuard],
    data: { roles: ['service'] }, // Rutas para proveedores de servicios
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard], // Ruta compartida para todos los usuarios autenticados
  },
  {
    path: '',
    redirectTo: 'auth/welcome',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth/welcome', // Redirige a welcome si la ruta no existe
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
