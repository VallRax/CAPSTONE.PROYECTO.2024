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

  /**
   * Captura una imagen con la cámara.
   */
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

  /**
   * Selecciona una imagen desde la galería.
   */
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

  /**
   * Muestra un indicador de carga.
   */
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  /**
   * Muestra un mensaje emergente (toast) con opciones personalizables.
   * Si no se especifica una duración, se establece un valor predeterminado de 3 segundos.
   */
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create({
      duration: opts?.duration || 2000, // Duración predeterminada: 2 segundos
      ...opts, // Conserva otras propiedades pasadas
      position: 'middle',
    });
    await toast.present();
  }

  /**
   * Navega a una página específica.
   * @param url Ruta a la que se quiere redirigir.
   */
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  /**
   * Guarda un elemento en el almacenamiento local.
   * @param key Clave para identificar el valor.
   * @param value Valor que se quiere almacenar.
   */
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Obtiene un elemento del almacenamiento local.
   * @param key Clave del valor que se quiere recuperar.
   */
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
}
