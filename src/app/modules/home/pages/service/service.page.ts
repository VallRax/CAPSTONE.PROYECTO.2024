import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Service } from 'src/app/models/service.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {
  service: Service | undefined;
  currentUser: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.service = await this.firebaseSvc.getDocument(`services/${serviceId}`) as Service;
    }
  }

  async loadCurrentUser() {
    try {
      const localUser = this.utilsSvc.getFromLocalStorage('user');
      if (!localUser || !localUser.uid) {
        throw new Error('Usuario no encontrado en el almacenamiento local.');
      }

      const userDoc = await this.firebaseSvc.getDocument(`users/${localUser.uid}`);
      if (!userDoc) {
        throw new Error('Documento de usuario no encontrado en Firebase.');
      }

      this.currentUser = userDoc as User;

      if (!this.currentUser.favorites) {
        this.currentUser.favorites = [];
      }

      console.log('Usuario cargado:', this.currentUser);
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      this.utilsSvc.routerLink('/auth/login');
    }
  }

  async toggleFavorite() {
    if (!this.service || !this.currentUser) return;

    try {
      const isFavorite = this.currentUser.favorites.includes(this.service.id);

      const updatedFavorites = isFavorite
        ? this.currentUser.favorites.filter((id) => id !== this.service.id)
        : [...this.currentUser.favorites, this.service.id];

      await this.firebaseSvc.setDocument(`users/${this.currentUser.uid}`, {
        ...this.currentUser,
        favorites: updatedFavorites,
      });

      this.currentUser.favorites = updatedFavorites;

      this.utilsSvc.presentToast({
        message: isFavorite
          ? 'Servicio eliminado de favoritos.'
          : 'Servicio añadido a favoritos.',
        color: 'success',
      });
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar favoritos.',
        color: 'danger',
      });
    }
  }

  isFavorite(): boolean {
    return this.currentUser?.favorites?.includes(this.service?.id || '') || false;
  }

  goBack() {
    this.navCtrl.back();
  }

  scheduleOffer(serviceId: string, offerId: string) {
    // Redirigir a la página de agendamiento
    this.router.navigate([`/home/schedule/${serviceId}/${offerId}`]);
  }
}
