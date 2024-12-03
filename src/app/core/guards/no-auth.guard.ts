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
      const defaultRedirect = user.roles.includes('client') 
        ? '/home' 
        : '/service-home';
      this.router.navigate([defaultRedirect]);
      return false;
    }

    // Si no hay sesión iniciada, permite el acceso a páginas no protegidas
    return true;
  }
}
