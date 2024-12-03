import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  // Capturar una imagen con la cámara
  async takePictureFromCamera() {
    try {
      return await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      throw error;
    }
  }

  // Seleccionar una imagen desde la galería
  async takePictureFromGallery() {
    try {
      return await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      throw error;
    }
  }

  // Recarga
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  // TOAST
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // Enruta a cualquier página disponible
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // Guarda un elemento en local storage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtiene un elemento del localStorage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
}
