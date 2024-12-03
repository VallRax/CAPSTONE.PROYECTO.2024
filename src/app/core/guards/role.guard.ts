import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Obtén los roles permitidos desde los datos de la ruta
    const allowedRoles: string[] = route.data['roles'] as string[];

    // Obtén la información del usuario desde el localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.role && allowedRoles.includes(user.role)) {
      return true; // Acceso permitido si el rol coincide
    }

    // Redirige si el usuario no tiene permisos
    this.router.navigate(['/home']);
    return false;
  }
}
