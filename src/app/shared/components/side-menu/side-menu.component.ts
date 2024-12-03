import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { User, UserRole } from 'src/app/models/user.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  currentUser: User | null = null;
  activeRole: UserRole; // Variable para gestionar el rol activo

  constructor(private router: Router, private firebaseSvc: FirebaseService) {}

  ngOnInit() {
    this.loadUserFromStorage();
    this.setInitialRole();
  }

  // Cargar usuario desde el almacenamiento local
  loadUserFromStorage() {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      this.currentUser = JSON.parse(localUser) as User;
    }
  }

  // Establecer el rol inicial
  setInitialRole() {
    if (this.currentUser?.roles.includes(UserRole.Client)) {
      this.activeRole = UserRole.Client;
    } else if (this.currentUser?.roles.includes(UserRole.Service)) {
      this.activeRole = UserRole.Service;
    }
  }

  // Determina si el rol activo es cliente
  isClient(): boolean {
    return this.activeRole === UserRole.Client;
  }

  // Determina si el rol activo es servicio
  isService(): boolean {
    return this.activeRole === UserRole.Service;
  }

  // Cambiar entre roles y redirigir
  toggleRole() {
    this.activeRole =
      this.activeRole === UserRole.Client ? UserRole.Service : UserRole.Client;

    // Redirigir a la página correspondiente
    const redirectPath =
      this.activeRole === UserRole.Client ? '/home' : '/service-home';
    this.router.navigate([redirectPath]);

    // Notificar al usuario
    this.firebaseSvc.utilsSvc.presentToast({
      message: `Ahora estás viendo como ${
        this.activeRole === UserRole.Client ? 'Cliente' : 'Servicio'
      }.`,
      color: 'success',
    });
  }

  // Navegar a una ruta específica
  navigateTo(path: string) {
    // No necesita ajustes según el rol, ya que el usuario elige explícitamente.
    this.router.navigate([path]);
    document.querySelector('ion-menu')?.close();
  }

  // Cerrar sesión
  signOut() {
    this.firebaseSvc.signOut();
    this.router.navigate(['/auth']);
    document.querySelector('ion-menu')?.close();
  }
}
