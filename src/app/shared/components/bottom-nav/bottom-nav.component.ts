import { Component, inject } from '@angular/core';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Router } from '@angular/router'; // Asegúrate de importar Router

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  firebaseSvc = inject(FirebaseService);
  menuCtrl = inject(MenuController);

  constructor(
    private navCtrl: NavController, 
    private router: Router, // Inyectar Router
    private modalController: ModalController
    ) {}

  async favorites() {
    await this.closeModal();
    this.router.navigate(['home/favorites']);
  }

  async home() {
    await this.closeModal();
    this.router.navigate(['/home']);
  }

  async signOut() {
    await this.closeModal();
    this.firebaseSvc.signOut();
  }

  private async closeModal() {
    try {
      await this.modalController.dismiss();
    } catch (error) {
      // Ignora el error si no hay ningún modal abierto
      console.warn('No modal to close:', error);
    }
  }

  async openMenu() {
    try {
      // Abrir el menú con ID "main-menu"
      await this.menuCtrl.open('main-menu');
    } catch (error) {
      console.error('Error al abrir el menú:', error);
    }
  }
}
