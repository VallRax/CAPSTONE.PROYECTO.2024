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

  async navigateTo(tab: string, event: Event) {
    event.stopPropagation(); // Detener propagación
    try {
      if (await this.menuCtrl.isOpen()) {
        await this.menuCtrl.close();
      }
      await this.modalController.dismiss().catch(() => {
        console.warn('No modals to close');
      });
      console.log('Navegando a:', tab);
      await this.router.navigate([`/${tab}`], { replaceUrl: true });
    } catch (error) {
      console.error('Error during navigation:', error);
    }
  }
  
  

  private syncActiveTab(url: string) {
    if (url.includes('/home/favorites')) {
      this.activeTab = 'favorites';
    } else if (url.includes('/home/scheduled-services')) {
      this.activeTab = 'scheduled-services';
    } else if (url.includes('/service-home')) {
      this.activeTab = 'service-home';
    } else if (url.includes('/service-home/service-appointments')) {
      this.activeTab = 'appointments-management';
    } else if (url.includes('/profile')) {
      this.activeTab = 'profile';
    } else {
      this.activeTab = ''; // Sin pestaña activa si no coincide
    }
  }
  
}
