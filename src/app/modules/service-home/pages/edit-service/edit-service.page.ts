import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  service: Service | null = null; // Para almacenar los datos del servicio
  form: FormGroup;
  serviceId: string;

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (!this.serviceId) {
      console.error('El ID del servicio no fue proporcionado.');
      this.utilsSvc.presentToast({
        message: 'Error: No se pudo cargar el servicio.',
        duration: 3000,
        color: 'danger',
      });
      this.utilsSvc.routerLink('/service-home'); // Redirigir en caso de error
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
  
      // Asegurar que 'offers' sea un array
      this.service.offers = this.service.offers || [];
  
      // Inicializa el formulario con los datos del servicio
      this.form = new FormGroup({
        name: new FormControl(this.service.name, Validators.required),
        category: new FormControl(this.service.category, Validators.required),
        description: new FormControl(this.service.description, Validators.required),
      });
    } catch (error) {
      console.error('Error al cargar el servicio:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar el servicio.',
        color: 'danger',
      });
      this.utilsSvc.routerLink('/service-home'); // Redirigir en caso de error
    }
  }
  
  

  async saveChanges() {
    if (this.form.valid) {
      try {
        const updatedService = {
          ...this.service,
          ...this.form.value,
          updatedAt: new Date().toISOString(), // Actualizar la marca temporal
        };

        await this.firebaseSvc.setDocument(`services/${this.serviceId}`, updatedService);
        console.log('Cambios guardados correctamente.');
        this.utilsSvc.presentToast({
          message: 'Servicio actualizado con éxito.',
          color: 'success',
        });
        this.utilsSvc.routerLink('/service-home');
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        this.utilsSvc.presentToast({
          message: 'Error al guardar los cambios.',
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

