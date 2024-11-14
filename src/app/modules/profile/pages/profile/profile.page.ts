import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { getAuth } from 'firebase/auth'; // Para autenticación de Firebase
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Para subir imágenes a Firebase Storage
import { doc, getFirestore, getDoc, setDoc } from 'firebase/firestore'; // Firestore para la base de datos

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileImage: string = 'assets/default-profile.png';  // Imagen por defecto
  userData: any = {}; // Datos del usuario
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  auth = getAuth(); // Obtenemos la autenticación
  storage = getStorage(); // Accedemos a Firebase Storage
  db = getFirestore(); // Accedemos a Firestore

  constructor(private router: Router, private navCtrl: NavController) { }

  // Método para cargar la información del usuario desde Firebase
  async loadUserData() {
    const user = this.auth.currentUser;
    if (user) {
      const userDoc = doc(this.db, 'users_test', user.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        this.userData = userSnap.data();  // Asignar los datos obtenidos al objeto userData
      }
    }
  }

  // Abrir el selector de archivos
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Subir la nueva imagen de perfil a Firebase Storage y actualizar el perfil del usuario
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
  }

  // Navegación
  Profile() {
    this.router.navigate(['/profile']);
  }

  home() {
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

  // Cargar los datos del usuario al inicializar
  ngOnInit() {
    this.loadUserData();  // Cargar datos del usuario desde Firebase
  }
}
