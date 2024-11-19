import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.page.html',
  styleUrls: ['./add-service.page.scss'],
})
export class AddServicePage {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}

  async submit() {
    if (this.form.valid) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.uid) {
        console.error('El usuario no está definido');
        return;
      }

      const id = this.firebaseSvc.createId(); // Generar ID único para el servicio
      const data = {
        id,
        ...this.form.value,
        providerId: user.uid, // Relacionar con el usuario que crea el servicio
        providerName: user.name || 'Proveedor Anónimo', // Nombre del proveedor
        timestamp: new Date().toISOString(), // Fecha de creación
      };

      try {
        await this.firebaseSvc.setDocument(`services/${id}`, data);
        console.log('Servicio creado con éxito');
        this.utilsSvc.routerLink('/service-home'); // Redirigir a service-home
      } catch (error) {
        console.error('Error al crear el servicio:', error);
      }
    }
  }
}
