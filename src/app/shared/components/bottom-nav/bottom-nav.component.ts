import { Component, inject } from '@angular/core';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
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
    private navCtrl: NavController, 
    private router: Router,
    private modalController: ModalController
  ) {}

  navigateTo(tab: string) {
    this.activeTab = tab; // Cambiar la pestaña activa
    this.router.navigate([`/${tab}`]);
    this.closeModal();
  }

  async signOut() {
    await this.closeModal();
    this.firebaseSvc.signOut();
  }

  private async closeModal() {
    try {
      await this.modalController.dismiss();
    } catch (error) {
      console.warn('No modal to close:', error);
    }
  }

  async openMenu() {
    try {
      await this.menuCtrl.open('main-menu');
    } catch (error) {
      console.error('Error al abrir el menú:', error);
    }
  }
}
