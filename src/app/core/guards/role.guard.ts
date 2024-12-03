import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let user: any; // Declarar la variable fuera del bloque try
    try {
      const allowedRoles: string[] = route.data['roles'] as string[]; // Roles permitidos para la ruta
      user = JSON.parse(localStorage.getItem('user'));

      // Verifica si el usuario tiene algún rol permitido
      if (
        user &&
        Array.isArray(user.roles) &&
        user.roles.some((role) => allowedRoles.includes(role))
      ) {
        return true;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }

    // Redirige si el usuario no tiene permisos
    const redirectRoute = user?.roles?.includes('service') ? '/service-home' : '/home';
    this.router.navigate([redirectRoute]);
    return false;
  }
}
