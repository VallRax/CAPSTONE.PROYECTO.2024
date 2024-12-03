import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  async takePicture(promptLabelHeader: string = 'Selecciona una opción') {
    // Configuración para la cámara con texto personalizado en el encabezado
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader, // Usa el valor recibido como argumento
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
    });
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