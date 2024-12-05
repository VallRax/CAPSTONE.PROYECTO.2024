import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Service } from 'src/app/models/service.model';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  selectedCategory: string;
  filteredServices: Service[] = [];
  allServices: Service[] = [];
  currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    // Cargar usuario actual
    await this.loadCurrentUser();

    // Cargar servicios desde Firebase
    await this.loadServices();

    // Obtener la categoría seleccionada de los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.selectedCategory = params['category'] || 'Otros';
      this.filterServicesByCategory();
    });
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

      // Inicializa favoritos si no existen
      if (!this.currentUser.favorites) {
        this.currentUser.favorites = [];
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      this.utilsSvc.routerLink('/auth/login');
    }
  }

  async loadServices() {
    try {
      this.allServices = await this.firebaseSvc.getCollection('services');
      this.filterServicesByCategory();
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  }

  // Filtrar los servicios por categoría
  filterServicesByCategory() {
    if (this.selectedCategory === 'Otros') {
      const predefinedCategories = [
        'Belleza',
        'Veterinaria',
        'Salud',
        'Fitness',
        'Hogar',
        'Tecnología',
        'Comida',
      ];
      this.filteredServices = this.allServices.filter(
        (service) => !predefinedCategories.includes(service.category)
      );
    } else {
      this.filteredServices = this.allServices.filter(
        (service) => service.category === this.selectedCategory
      );
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

  goBack() {
    this.navCtrl.back();
  }
}
