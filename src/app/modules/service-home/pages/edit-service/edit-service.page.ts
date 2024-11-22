import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Service } from 'src/app/models/service.model';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.page.html',
  styleUrls: ['./edit-service.page.scss'],
})
export class EditServicePage implements OnInit {
  service: Service | null = null; // Datos del servicio
  serviceId: string;
  isEditingField = { name: false, category: false, description: false }; // Control de edición por campo

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (!this.serviceId) {
      this.utilsSvc.presentToast({
        message: 'Error: No se pudo cargar el servicio.',
        duration: 3000,
        color: 'danger',
      });
      this.utilsSvc.routerLink('/service-home');
      return;
    }
    this.loadService();
  }

  async loadService() {
    try {
      const path = `services/${this.serviceId}`;
      this.service = await this.firebaseSvc.getDocument(path) as Service;
      if (!this.service) {
        throw new Error('El servicio no existe.');
      }
    } catch (error) {
      console.error('Error al cargar el servicio:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar el servicio.',
        color: 'danger',
      });
      this.utilsSvc.routerLink('/service-home');
    }
  }

  async openEditAlert(field: string, currentValue: string) {
    const alert = await this.alertCtrl.create({
      header: `Editar ${field}`,
      inputs: [
        {
          name: 'value',
          type: field === 'description' ? 'textarea' : 'text',
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
          text: 'Confirmar',
          handler: (data) => {
            this.updateField(field, data.value);
          },
        },
      ],
    });

    await alert.present();
  }

  async updateField(field: string, value: string) {
    if (this.service) {
      this.service[field] = value;

      try {
        const path = `services/${this.serviceId}`;
        await this.firebaseSvc.setDocument(path, this.service);
        this.utilsSvc.presentToast({
          message: `${field} actualizado con éxito.`,
          color: 'success',
        });
      } catch (error) {
        console.error(`Error al actualizar ${field}:`, error);
        this.utilsSvc.presentToast({
          message: `Error al actualizar ${field}.`,
          color: 'danger',
        });
      }
    }
  }

  async deleteOffer(index: number) {
    if (!this.service) {
      console.error('El servicio no está definido.');
      return;
    }

    try {
      // Eliminar la oferta del array
      this.service.offers.splice(index, 1);

      // Actualizar el documento del servicio en Firebase
      const path = `services/${this.serviceId}`;
      await this.firebaseSvc.setDocument(path, this.service);

      console.log('Oferta eliminada con éxito.');
      this.utilsSvc.presentToast({
        message: 'Oferta eliminada con éxito.',
        color: 'success',
      });
    } catch (error) {
      console.error('Error al eliminar la oferta:', error);
      this.utilsSvc.presentToast({
        message: 'Error al eliminar la oferta.',
        color: 'danger',
      });
    }
  }
  
}
