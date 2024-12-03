import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      if (user.role === 'client') {
        return true; // Cliente puede acceder a rutas de cliente
      } else if (user.role === 'service') {
        return true; // Servicio puede acceder a rutas de servicio
      }
    }
    this.router.navigate(['/auth/login']); // Redirigir si no está autenticado o el rol es inválido
    return false;
  }
}
