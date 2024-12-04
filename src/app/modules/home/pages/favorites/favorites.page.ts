import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Service } from 'src/app/models/service.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favoriteServices: Service[] = [];
  currentUser: User;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();
    await this.loadFavoriteServices();
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

  async loadFavoriteServices() {
    try {
      const allServices = await this.firebaseSvc.getCollection('services');
      this.favoriteServices = allServices.filter((service) =>
        this.currentUser.favorites.includes(service.id)
      );

      console.log('Servicios favoritos cargados:', this.favoriteServices);
      
    } catch (error) {
      console.error('Error al cargar servicios favoritos:', error);
    }
  }

  async toggleFavorite(service: Service) {
    try {
      if (!this.currentUser) throw new Error('Usuario no definido.');
  
      const isFavorite = this.currentUser.favorites?.includes(service.id) || false;
      const updatedFavorites = isFavorite
        ? this.currentUser.favorites.filter((id) => id !== service.id)
        : [...(this.currentUser?.favorites || []), service.id];

      await this.firebaseSvc.setDocument(`users/${this.currentUser.uid}`, {
        ...this.currentUser,
        favorites: updatedFavorites,
      });
  
      this.currentUser.favorites = updatedFavorites;
  
      // Actualizar la lista de servicios favoritos
      this.favoriteServices = this.favoriteServices.filter((fav) =>
        updatedFavorites.includes(fav.id)
      );
  
      // Mostrar mensaje con duración automática
      this.utilsSvc.presentToast({
        message: isFavorite
          ? 'Servicio eliminado de favoritos.'
          : 'Servicio añadido a favoritos.',
        color: 'success',
        duration: 3000, // Mensaje desaparece en 3 segundos
      });
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
  
      // Mostrar mensaje de error con duración automática
      this.utilsSvc.presentToast({
        message: 'Error al actualizar favoritos.',
        color: 'danger',
        duration: 3000, // Mensaje desaparece en 3 segundos
      });
    }
  }

  goToServiceDetails(serviceId: string) {
    this.router.navigate([`/home/service/${serviceId}`]);
  }

  goBack() {
    this.navCtrl.back();
  }
}
