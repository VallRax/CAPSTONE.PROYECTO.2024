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

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles: string[] = route.data['roles'] as string[];
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && allowedRoles.some((role) => user.roles.includes(role))) {
      return true;
    }

    // Redirige al home según el primer rol del usuario
    const redirectPath = user?.roles.includes('client') ? '/home' : '/service-home';
    this.router.navigate([redirectPath]);
    return false;
  }
}
