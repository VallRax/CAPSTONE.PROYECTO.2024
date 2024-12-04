import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any = {}; // Datos del usuario
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  auth = getAuth(); // Autenticación de Firebase
  db = getFirestore(); // Firestore de Firebase
  actionSheetCtrl = inject(ActionSheetController);
  loadingCtrl = inject(LoadingController);

  constructor() {}

  // Cargar datos del usuario
  async loadUserData(uid: string) {
    try {
      const userDoc = doc(this.db, 'users', uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        this.userData = userSnap.data();
      } else {
        console.warn('Usuario no encontrado en Firestore.');
      }
    } catch (error) {
      console.error('Error cargando datos de usuario:', error);
    }
  }

  // Mostrar Action Sheet para elegir la opción
  async showImageOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Tomar Foto',
          icon: 'camera',
          handler: () => {
            this.takePhoto();
          },
        },
        {
          text: 'Subir Foto',
          icon: 'image',
          handler: () => {
            this.uploadPhoto();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
  

  // Tomar una foto con la cámara
  async takePhoto() {
    try {
      const picture = await this.utilsSvc.takePictureFromCamera();
      await this.processImage(picture.dataUrl);
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.utilsSvc.presentToast({ message: 'Error al tomar la foto', color: 'danger' });
    }
  }
  

  // Subir una foto desde la galería
  async uploadPhoto() {
    try {
      const picture = await this.utilsSvc.takePictureFromGallery();
      await this.processImage(picture.dataUrl);
    } catch (error) {
      console.error('Error al subir la foto:', error);
      this.utilsSvc.presentToast({ message: 'Error al subir la foto', color: 'danger' });
    }
  }
  

  // Procesar la imagen capturada o seleccionada
  async processImage(dataUrl: string) {
    let loading;
    try {
      loading = await this.utilsSvc.loading();
      await loading.present();
  
      // Convertir el DataURL a Blob y luego a File
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `profile-${this.auth.currentUser?.uid}.jpg`, { type: blob.type });
  
      // Subir la imagen al Storage con una ruta específica para perfiles
      const filePath = `profile-images/${this.auth.currentUser?.uid}/profile.jpg`;
      const imageUrl = await this.firebaseSvc.uploadImage(filePath, file);
  
      // Guardar la URL en Firestore bajo el documento del usuario
      const userDocRef = doc(this.db, 'users', this.auth.currentUser?.uid);
      await setDoc(userDocRef, { profileImageUrl: imageUrl }, { merge: true });
  
      // Actualizar la vista del perfil con la nueva URL
      this.userData.profileImageUrl = imageUrl;
  
      // Mostrar mensaje de éxito
      this.utilsSvc.presentToast({
        message: 'Imagen de perfil actualizada correctamente',
        color: 'success',
      });
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
  
      // Mostrar mensaje de error
      this.utilsSvc.presentToast({
        message: 'Error al actualizar la imagen',
        color: 'danger',
      });
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  }
  

  ngOnInit() {
    // Escuchar los cambios en el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadUserData(user.uid); // Cargar los datos del usuario si está autenticado
      } else {
        console.warn('No hay un usuario autenticado.');
      }
    });
  }
}
