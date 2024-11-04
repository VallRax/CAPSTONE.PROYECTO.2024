import { Component, inject } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router'; // Asegúrate de importar Router

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  firebaseSvc = inject(FirebaseService);

  constructor(
    private navCtrl: NavController, 
    private router: Router, // Inyectar Router
    private modalController: ModalController
    ) {}

  async profile() {
    await this.closeModal();
    this.router.navigate(['/profile']);
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
}
