import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role === 'client') {
        this.router.navigate(['/home']); // Redirige a home si es cliente
      } else if (user.role === 'service') {
        this.router.navigate(['/home']); // Redirige a página de servicio si es proveedor
      }
      return false;
    }
    return true;
  }
}
