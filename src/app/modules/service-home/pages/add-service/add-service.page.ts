import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';

import { Service } from 'src/app/models/service.model';


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
    //price: new FormControl(null, [Validators.required, Validators.min(0)]) // Validación para valores no negativos
  });

  //imageFile: File | null = null; // Archivo de imagen seleccionado

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.imageFile = input.files[0]; // Asignar archivo seleccionado
  //   }
  // }

  async submit() {
    if (this.form.valid) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.uid) {
        console.error('El usuario no está definido');
        return;
      }
  
      const id = this.firebaseSvc.createId(); // Generar ID único para el servicio
      const timestamp = new Date().toISOString(); // Fecha actual
  
      const data: Service = {
        id,
        name: this.form.controls.name.value,
        category: this.form.controls.category.value,
        description: this.form.controls.description.value,
        providerId: user.uid, // Relacionar con el usuario que crea el servicio
        providerName: user.name || 'Proveedor Anónimo', // Nombre del proveedor
        imageUrl: this.getRandomImage(), // Imagen aleatoria de ejemplo
        createdAt: timestamp, // Fecha de creación
        updatedAt: timestamp, // Fecha de última actualización
        offers: [] // Inicialmente vacío
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
  
  
  getRandomImage() {
    const randomNum = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/600/400?random=${randomNum}`;
  }
}
