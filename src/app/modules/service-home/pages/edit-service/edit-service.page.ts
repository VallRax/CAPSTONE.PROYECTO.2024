import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
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

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router // Para redirigir a otras páginas
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

  /**
   * Carga el servicio desde Firebase.
   */
  async loadService() {
    try {
      const path = `services/${this.serviceId}`;
      this.service = (await this.firebaseSvc.getDocument(path)) as Service;

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

  /**
   * Abre un cuadro de diálogo para editar un campo del servicio.
   */
  async openEditAlert(field: keyof Service, currentValue: string) {
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

  /**
   * Actualiza un campo del servicio en Firebase.
   */
  async updateField(field: keyof Service, value: any) {
    if (this.service) {
      // Verifica si el campo es 'offers' y el valor no es un arreglo
      if (field === 'offers' && !Array.isArray(value)) {
        console.error('Intento de asignar un valor no válido a "offers". Se esperaba un arreglo de ofertas.');
        return;
      }
  
      // Asigna el valor al campo correspondiente
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
  

  /**
   * Elimina una oferta específica del servicio.
   */
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

  /**
   * Redirige a la página de edición de una oferta.
   */
  editOffer(offerId: string) {
    this.router.navigate(['/service-home/edit-offer', this.serviceId, offerId]);
  }

  /**
   * Elimina el servicio actual.
   */
  async deleteService() {
    if (!this.serviceId) {
      this.utilsSvc.presentToast({
        message: 'No se puede eliminar el servicio: ID no encontrado.',
        color: 'danger',
      });
      return;
    }

    try {
      const path = `services/${this.serviceId}`;
      await this.firebaseSvc.deleteDocument(path);
      this.utilsSvc.presentToast({
        message: 'Servicio eliminado con éxito.',
        color: 'success',
      });
      this.navCtrl.back(); // Regresa a la página anterior
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      this.utilsSvc.presentToast({
        message: 'Error al eliminar el servicio.',
        color: 'danger',
      });
    }
  }

  /**
   * Redirige a la página anterior.
   */
  goBack() {
    this.navCtrl.back();
  }
}
