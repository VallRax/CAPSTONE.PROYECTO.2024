import { Component, inject, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { User, UserRole } from 'src/app/models/user.model';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent implements OnInit {
  firebaseSvc = inject(FirebaseService);
  menuCtrl = inject(MenuController);
  activeTab: string = 'home'; // Inicializar con la pestaña activa predeterminada
  currentUser: User | null = null;
  isClient: boolean = false;

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

  ngOnInit() {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user) as User;
      this.isClient = this.currentUser.roles.includes(UserRole.Client);
    }
  }

  async navigateTo(tab: string) {
    try {
      // Cierra el menú lateral si está abierto
      if (await this.menuCtrl.isOpen()) {
        await this.menuCtrl.close();
      }
  
      // Cierra cualquier modal que esté abierto
      await this.modalController.dismiss().catch(() => {
        console.warn('No modals to close');
      });
  
      // Navega a la nueva página y reinicia el historial
      await this.router.navigate([`/${tab}`], { replaceUrl: true });
    } catch (error) {
      console.error('Error during navigation:', error);
    }
  }
  

  private syncActiveTab(url: string) {
    // Actualizar la pestaña activa basado en la ruta
    if (url.includes('/home/favorites')) {
      this.activeTab = 'favorites';
    } else if (url.includes('/home/scheduled-services')) {
      this.activeTab = 'scheduled-services';
    } else if (url.includes('/home')) {
      this.activeTab = 'home';
    } else if (url.includes('/profile')) {
      this.activeTab = 'profile';
    } else {
      this.activeTab = ''; // Si no coincide, ninguna pestaña activa
    }
  }
}
