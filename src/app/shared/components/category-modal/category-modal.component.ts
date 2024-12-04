import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Service } from 'src/app/models/service.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent implements OnInit {
  @Input() selectedCategory: { name: string; icon: string };
  @Input() services: Service[] = [];

  filteredServices: Service[] = [];
  currentUser: User;
  predefinedCategories: string[] = ['Belleza', 'Veterinaria', 'Salud', 'Fitness', 'Hogar', 'Tecnología', 'Comida'];

  constructor(
    private modalCtrl: ModalController,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();

    // Filtrar servicios según la categoría seleccionada o asignarlos a "Otros"
    if (this.selectedCategory.name === 'Otros') {
      this.filteredServices = this.services.filter(
        (service) => !this.predefinedCategories.includes(service.category)
      );
    } else {
      this.filteredServices = this.services.filter(
        (service) => service.category === this.selectedCategory.name
      );
    }
  }

  async loadCurrentUser() {
    try {
      const localUser = this.utilsSvc.getFromLocalStorage('user');
      if (!localUser || !localUser.uid) {
        throw new Error('Usuario no autenticado.');
      }
      this.currentUser = await this.firebaseSvc.getDocument(`users/${localUser.uid}`) as User;
      if (!this.currentUser.favorites) {
        this.currentUser.favorites = [];
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  isServiceFavorite(serviceId: string): boolean {
    return this.currentUser?.favorites?.includes(serviceId) || false;
  }

  async toggleFavorite(service: Service) {
    try {
      if (!this.currentUser) throw new Error('Usuario no definido.');

      const isFavorite = this.isServiceFavorite(service.id);

      const updatedFavorites = isFavorite
        ? this.currentUser.favorites.filter((id) => id !== service.id)
        : [...(this.currentUser?.favorites || []), service.id];

      // Actualizar en Firebase
      await this.firebaseSvc.setDocument(`users/${this.currentUser.uid}`, {
        ...this.currentUser,
        favorites: updatedFavorites,
      });

      // Actualizar favoritos localmente
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

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  openServiceDetails(serviceId: string) {
    this.router.navigate([`/home/service/${serviceId}`]);
    this.dismissModal(); // Cierra el modal al navegar
  }
}
