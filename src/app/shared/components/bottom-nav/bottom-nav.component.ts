import { Component, inject } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  firebaseSvc = inject(FirebaseService);
  menuCtrl = inject(MenuController);
  activeTab: string = 'home'; // Inicializar con la pestaña activa predeterminada

  constructor(
    private router: Router,
    private modalController: ModalController
  ) {
    // Escuchar cambios en la ruta activa
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.syncActiveTab(event.urlAfterRedirects);
      }
    });
  }

  navigateTo(tab: string) {
    this.router.navigate([`/${tab}`]);
    this.closeModal();
  }

  private syncActiveTab(url: string) {
    // Actualizar la pestaña activa basado en la ruta
    if (url.includes('/home/favorites')) {
      this.activeTab = 'favorites';
    } else if (url.includes('/home/scheduled-services')) {
      this.activeTab = 'scheduled-services';
    } else if (url.includes('/home')) {
      this.activeTab = 'home';
    } else {
      this.activeTab = ''; // Si no coincide, ninguna pestaña activa
    }
  }

  async openMenu() {
    try {
      await this.menuCtrl.open('main-menu');
    } catch (error) {
      console.error('Error al abrir el menú:', error);
    }
  }

  private async closeModal() {
    try {
      await this.modalController.dismiss();
    } catch (error) {
      console.warn('No modal to close:', error);
    }
  }
}
