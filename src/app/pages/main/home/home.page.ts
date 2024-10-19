import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { library, playCircle, radio, search } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  


 

  selectedCategory: string = 'Belleza y estética';  // Categoría por defecto

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  navCtrl = inject(NavController);  // Inyecta NavController

  ngOnInit() {
  }

  // Función para seleccionar una categoría
  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  goToServiceName() {
    this.navCtrl.navigateForward('/service-name');
  }

  goToDescription() {
    this.navCtrl.navigateForward('/service-description');
  }

  goToCategory() {
    this.navCtrl.navigateForward('/service-category');
  }

  goToContact() {
    this.navCtrl.navigateForward('/service-contact');
  }

  goToLocation() {
    this.navCtrl.navigateForward('/service-location');
  }

  Profile() {
    this.router.navigate(['/profile']);  // Navegar a la página de perfil
  }

  home(){
    this.router.navigate(['/home']);
  }


  signOut() {
    this.firebaseSvc.signOut();
  }

  constructor(private router: Router) {
    /**
     * Any icons you want to use in your application
     * can be registered in app.component.ts and then
     * referenced by name anywhere in your application.
     */
    addIcons({ library, playCircle, radio, search });
  }

}
