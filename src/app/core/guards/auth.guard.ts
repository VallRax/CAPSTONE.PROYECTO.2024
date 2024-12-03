import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.roles && user.roles.length > 0) {
      return true;
    }

    // Si no está autenticado, redirige a la página de bienvenida
    this.router.navigate(['/auth/welcome']);
    return false;
  }
}
