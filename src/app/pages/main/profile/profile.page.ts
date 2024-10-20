import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { library, playCircle, radio, search } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileImage: string = 'assets/default-profile.png';  // Ruta de la imagen por defecto

   // Acceso al input de tipo file mediante @ViewChild
   @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  @Input() backButton!: string; 
  navCtrl = inject(NavController);  // Inyecta NavController

  constructor(private router: Router) { }
  
  // Esta función se dispara al hacer clic en el botón para abrir el input de tipo file
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

   // Esta función se dispara cuando el usuario selecciona un archivo
   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;  // Asignar la imagen seleccionada al perfil
      };
      reader.readAsDataURL(file);  // Leer la imagen seleccionada como base64
    }
  }


  Profile() {
    this.router.navigate(['/profile']);  // Navegar a la página de perfil
  }

  home(){
    this.router.navigate(['/main/home']);
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

 

  ngOnInit() {
    const savedImage = localStorage.getItem('profileImage');  // Intentar obtener la imagen del almacenamiento local
    if (savedImage) {
      this.profileImage = savedImage;  // Si hay una imagen guardada, se establece como imagen de perfil
    }
  }

}
