import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome', // Cambia a la ruta de bienvenida para que sea la primera página que se muestre
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/main/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule), canActivate: [NoAuthGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/main/profile/profile.module').then(m => m.ProfilePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'lobby',
    loadChildren: () => import('./pages/lobby/lobby.module').then( m => m.LobbyPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }