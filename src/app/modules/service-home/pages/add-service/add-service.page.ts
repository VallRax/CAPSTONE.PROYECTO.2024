import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
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
    availableDays: new FormControl([], Validators.required),
  });

  availableHours: { startTime: string; endTime: string }[] = []; // Lista para almacenar horarios

  //imageFile: File | null = null; // Archivo de imagen seleccionado

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService, private alertCtrl: AlertController) {}

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
        ownerId: user.uid, // Relacionar con el usuario que crea el servicio
        imageUrl: this.getRandomImage(), // Imagen aleatoria de ejemplo
        createdAt: timestamp, // Fecha de creación
        updatedAt: timestamp, // Fecha de última actualización
        offers: [], // Inicialmente vacío    
        availableDays: this.form.controls.availableDays.value,
        availableHours: this.availableHours, // Agregar los horarios ingresados
        blockedTimeSlots: [],  
        
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

  async addAvailableHour() {
    const alert = await this.alertCtrl.create({
      header: 'Añadir Horario',
      inputs: [
        {
          name: 'startTime',
          type: 'time',
          placeholder: 'Hora de inicio',
        },
        {
          name: 'endTime',
          type: 'time',
          placeholder: 'Hora de fin',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Añadir',
          handler: (data) => {
            if (data.startTime && data.endTime) {
              this.availableHours.push({
                startTime: data.startTime,
                endTime: data.endTime,
              });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  removeAvailableHour(index: number) {
    this.availableHours.splice(index, 1);
  }
}
