import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.page.html',
})
export class AddServicePage {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    availableDays: new FormControl([]),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    blockDate: new FormControl(''),
    blockStartTime: new FormControl(''),
    blockEndTime: new FormControl(''),
    reason: new FormControl(''),
  });

  availableHours: any[] = [];
  blockedTimeSlots: any[] = [];
  localImage: string | null = null; // Imagen seleccionada localmente
  imageFile: File | null = null; // Archivo de la imagen
  defaultImageUrl = 'assets/no-image.jpg'; // Ruta local de la imagen predeterminada

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  // Deshabilitar "Añadir Horario" si los campos no están completos
  get isAddHourDisabled() {
    const days = this.form.get('availableDays')?.value;
    const startTime = this.form.get('startTime')?.value;
    const endTime = this.form.get('endTime')?.value;
    return !(days && days.length > 0 && startTime && endTime && startTime < endTime);
  }

  // Deshabilitar "Añadir Bloqueo" si los campos no están completos
  get isAddBlockDisabled() {
    const blockDate = this.form.get('blockDate')?.value;
    const blockStartTime = this.form.get('blockStartTime')?.value;
    const blockEndTime = this.form.get('blockEndTime')?.value;
    return !(blockDate && blockStartTime && blockEndTime && blockStartTime < blockEndTime);
  }

  // Agregar horario disponible
  addAvailableHour() {
    const days = this.form.get('availableDays')?.value;
    const startTime = this.form.get('startTime')?.value;
    const endTime = this.form.get('endTime')?.value;

    this.availableHours.push({ days, startTime, endTime });
    this.form.patchValue({ availableDays: [], startTime: '', endTime: '' }); // Limpiar campos
  }

  // Eliminar un horario
  removeAvailableHour(index: number) {
    this.availableHours.splice(index, 1);
  }

  // Agregar un bloqueo de horario
  addBlockedTimeSlot() {
    const blockDate = this.form.get('blockDate')?.value;
    const blockStartTime = this.form.get('blockStartTime')?.value;
    const blockEndTime = this.form.get('blockEndTime')?.value;
    const reason = this.form.get('reason')?.value;

    this.blockedTimeSlots.push({
      blockDate,
      blockStartTime,
      blockEndTime,
      reason,
    });
    this.form.patchValue({
      blockDate: '',
      blockStartTime: '',
      blockEndTime: '',
      reason: '',
    }); // Limpiar campos
  }

  // Eliminar un bloqueo de horario
  removeBlockedTimeSlot(index: number) {
    this.blockedTimeSlots.splice(index, 1);
  }

  // Seleccionar una foto desde el dispositivo
  async selectPhoto() {
    try {
      const picture = await this.utilsSvc.takePictureFromGallery();
      const response = await fetch(picture.dataUrl);
      const blob = await response.blob();
      this.imageFile = new File([blob], 'service-image.jpg', { type: blob.type });
      this.localImage = picture.dataUrl; // Vista previa de la imagen
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      this.utilsSvc.presentToast({
        message: 'Error al seleccionar la imagen',
        color: 'danger',
      });
    }
  }

  // Subir el formulario junto con la imagen al guardar el servicio
  async submit() {
    if (this.form.invalid || this.availableHours.length === 0) {
      this.utilsSvc.presentToast({
        message: 'Debe completar los campos obligatorios y añadir al menos un horario.',
        color: 'danger',
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.uid) {
      console.error('El usuario no está definido');
      return;
    }

    const id = this.firebaseSvc.createId();
    const timestamp = new Date().toISOString();

    const data: any = {
      ...this.form.value,
      id,
      availableHours: this.availableHours,
      blockedTimeSlots: this.blockedTimeSlots,
      ownerId: user.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      if (this.imageFile) {
        // Si el usuario selecciona una imagen, súbela a Firebase Storage
        const filePath = `service-images/${user.uid}/service-${id}.jpg`;
        const imageUrl = await this.firebaseSvc.uploadImage(filePath, this.imageFile);
        data.imageUrl = imageUrl; // URL de la imagen personalizada
      } else {
        // Si no hay imagen seleccionada, usar la imagen predeterminada
        data.imageUrl = this.defaultImageUrl;
      }

      await this.firebaseSvc.setDocument(`services/${id}`, data);
      this.utilsSvc.presentToast({
        message: 'Servicio creado con éxito.',
        color: 'success',
      });
      this.utilsSvc.routerLink('/service-home');
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
      this.utilsSvc.presentToast({
        message: 'Error al guardar el servicio.',
        color: 'danger',
      });
    }
  }

  goBack() {
    this.utilsSvc.routerLink('/service-home');
  }
}
