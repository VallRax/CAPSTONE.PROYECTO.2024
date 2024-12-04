import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Service } from 'src/app/models/service.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class homePage implements OnInit {
  categories = [
    { name: 'Belleza', icon: 'cut' },
    { name: 'Veterinaria', icon: 'paw' },
    { name: 'Salud', icon: 'medkit' },
    { name: 'Fitness', icon: 'barbell' },
    { name: 'Hogar', icon: 'home' },
    { name: 'Tecnología', icon: 'laptop' },
    { name: 'Comida', icon: 'pizza' },
    { name: 'Otros', icon: 'ellipsis-horizontal' },
  ];

  services: Service[] = [];
  currentUser: User;

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService, private router: Router) {}

  async ngOnInit() {
    await this.loadCurrentUser();
    await this.loadServices();
    await this.syncFavorites();
  }

  // Cargar usuario actual desde Firebase
  // Cargar usuario actual desde Firebase
async loadCurrentUser() {
  try {
    // Obtén el ID del usuario desde el almacenamiento local o una variable global
    const localUser = this.utilsSvc.getFromLocalStorage('user'); // Asegúrate de que se guarde en el login
    if (!localUser || !localUser.uid) {
      throw new Error('Usuario no encontrado en el almacenamiento local.');
    }

    // Busca el usuario en Firebase
    const userDoc = await this.firebaseSvc.getDocument(`users/${localUser.uid}`);
    if (!userDoc) {
      throw new Error('Documento de usuario no encontrado en Firebase.');
    }

    this.currentUser = userDoc as User;

    // Inicializa favoritos si no existen
    if (!this.currentUser.favorites) {
      this.currentUser.favorites = [];
    }

    console.log('Usuario cargado:', this.currentUser);
  } catch (error) {
    console.error('Error al cargar el usuario:', error);

    // Redirige al login si no hay autenticación
    this.utilsSvc.routerLink('/auth/login');
  }
} 

  // Cargar servicios desde Firebase
  async loadServices() {
    try {
      this.services = await this.firebaseSvc.getCollection('services');
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  }

  // Sincronizar favoritos del usuario eliminando los que no existen
  async syncFavorites() {
    try {
      if (this.currentUser?.favorites && Array.isArray(this.currentUser.favorites)) {
        const validFavorites = this.currentUser.favorites.filter((favoriteId) =>
          this.services.some((service) => service.id === favoriteId)
        );
  
        if (validFavorites.length !== this.currentUser.favorites.length) {
          this.currentUser.favorites = validFavorites;
  
          await this.firebaseSvc.setDocument(`users/${this.currentUser.uid}`, {
            ...this.currentUser,
            favorites: validFavorites,
          });
        }
      } else {
        this.currentUser.favorites = [];
      }
    } catch (error) {
      console.error('Error al sincronizar favoritos:', error);
    }
  }  
  

  async toggleFavorite(service: Service) {
    try {
      if (!this.currentUser) throw new Error('Usuario no definido.');
  
      const isFavorite = this.currentUser.favorites?.includes(service.id) || false;
  
      console.log('Favorito actual:', isFavorite);
      console.log('Servicio:', service);
  
      const updatedFavorites = isFavorite
        ? this.currentUser.favorites.filter((id) => id !== service.id)
        : [...(this.currentUser?.favorites || []), service.id];
  
      console.log('Favoritos actualizados:', updatedFavorites);
  
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

  goToServiceDetails(serviceId: string) {
    this.router.navigate([`/home/service/${serviceId}`]);
  }
  
}
