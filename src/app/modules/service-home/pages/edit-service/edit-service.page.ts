import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Service } from 'src/app/models/service.model';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.page.html',
  styleUrls: ['./edit-service.page.scss'],
})
export class EditServicePage implements OnInit {
  service: Service | null = null;
  serviceId: string;
  localImage: string | null = null;
  imageFile: File | null = null;
  defaultImageUrl = 'assets/no-image.jpg';

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (!this.serviceId) {
      this.utilsSvc.presentToast({
        message: 'Error: No se pudo cargar el servicio.',
        color: 'danger',
      });
      this.navCtrl.back();
      return;
    }
    this.loadService();
  }

  async loadService() {
    try {
      const path = `services/${this.serviceId}`;
      this.service = (await this.firebaseSvc.getDocument(path)) as Service;
    } catch (error) {
      console.error('Error al cargar el servicio:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar el servicio.',
        color: 'danger',
      });
    }
  }

  async selectPhoto() {
    try {
      const picture = await this.utilsSvc.takePictureFromGallery();
      const response = await fetch(picture.dataUrl);
      const blob = await response.blob();
      this.imageFile = new File([blob], 'service-image.jpg', { type: blob.type });
      this.localImage = picture.dataUrl;
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  }

  async saveImage() {
    if (this.imageFile) {
      const filePath = `service-images/${this.service.ownerId}/service-${this.serviceId}.jpg`;
      this.service.imageUrl = await this.firebaseSvc.uploadImage(filePath, this.imageFile);
    }
  }

  async deleteService() {
    try {
      if (!this.serviceId) {
        this.utilsSvc.presentToast({
          message: 'No se encontró el ID del servicio.',
          color: 'danger',
        });
        return;
      }

      const path = `services/${this.serviceId}`;
      await this.firebaseSvc.deleteDocument(path);

      this.utilsSvc.presentToast({
        message: 'Servicio eliminado con éxito.',
        color: 'success',
      });

      this.navCtrl.back();
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      this.utilsSvc.presentToast({
        message: 'Error al eliminar el servicio.',
        color: 'danger',
      });
    }
  }

  async openEditAlert<K extends keyof Service>(field: K, currentValue: Service[K]) {
    const alert = await this.alertCtrl.create({
      header: `Editar ${field}`,
      inputs: [
        {
          name: 'value',
          type: 'text',
          placeholder: `Editar ${field}`,
          value: currentValue,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (this.service) {
              this.service[field] = data.value as Service[K]; // Ajuste al tipo correcto
              this.saveChanges();
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  

  async updateDays(event: any) {
    if (this.service) {
      this.service.availableDays = event.detail.value;
      this.saveChanges();
    }
  }

  async editAvailableHours() {
    const alert = await this.alertCtrl.create({
      header: 'Añadir Horario',
      inputs: [
        { name: 'startTime', type: 'time', placeholder: 'Hora de Inicio' },
        { name: 'endTime', type: 'time', placeholder: 'Hora de Fin' },
        { name: 'days', type: 'text', placeholder: 'Días (e.g., monday,tuesday)' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.startTime && data.endTime && this.service) {
              const daysArray = data.days?.split(',').map((day: string) => day.trim()) || [];
              this.service.availableHours.push({
                startTime: data.startTime,
                endTime: data.endTime,
                days: daysArray,
              });
              this.saveChanges();
            }
          },
        },
      ],
    });
    await alert.present();
  }
  

  async editBlockedTimeSlots() {
    const alert = await this.alertCtrl.create({
      header: 'Añadir Bloqueo',
      inputs: [
        { name: 'days', type: 'text', placeholder: 'Días (e.g., monday,tuesday)' },
        { name: 'startTime', type: 'time', placeholder: 'Hora de Inicio' },
        { name: 'endTime', type: 'time', placeholder: 'Hora de Fin' },
        { name: 'reason', type: 'text', placeholder: 'Motivo' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.days && data.startTime && data.endTime && this.service) {
              const daysArray = data.days.split(',').map((day: string) => day.trim()); // Convertir a string[]
              this.service.blockedTimeSlots.push({
                days: daysArray,
                startTime: data.startTime,
                endTime: data.endTime,
                reason: data.reason || 'Sin motivo',
              });
              this.saveChanges();
            }
          },
        },
      ],
    });
    await alert.present();
  }
  

  async removeAvailableHour(index: number) {
    if (this.service) {
      this.service.availableHours.splice(index, 1);
      this.saveChanges();
    }
  }

  async removeBlockedTimeSlot(index: number) {
    if (this.service) {
      this.service.blockedTimeSlots.splice(index, 1);
      this.saveChanges();
    }
  }

  async saveChanges() {
    try {
      const path = `services/${this.serviceId}`;
      await this.firebaseSvc.setDocument(path, this.service);
      this.utilsSvc.presentToast({ message: 'Cambios guardados.', color: 'success' });
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      this.utilsSvc.presentToast({ message: 'Error al guardar cambios.', color: 'danger' });
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
