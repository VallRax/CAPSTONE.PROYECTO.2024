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
    availableDays: new FormControl([], Validators.required), // Días de atención
    startTime: new FormControl('', Validators.required), // Hora de apertura
    endTime: new FormControl('', Validators.required), // Hora de cierre
    blockDays: new FormControl([]), // Días seleccionados para bloqueo
    blockStartTime: new FormControl(''),
    blockEndTime: new FormControl(''),
    reason: new FormControl(''),
  });

  blockedTimeSlots: { days: string[]; startTime: string; endTime: string; reason: string }[] = [];
  localImage: string | null = null;
  imageFile: File | null = null;
  defaultImageUrl = 'assets/no-image.jpg';

  allDays = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' },
  ];

  categories = [
    { name: 'Belleza', icon: 'cut' },
    { name: 'Veterinaria', icon: 'paw' },
    { name: 'Salud', icon: 'medkit' },
    { name: 'Fitness', icon: 'barbell' },
    { name: 'Hogar', icon: 'home' },
    { name: 'Tecnología', icon: 'laptop' },
    { name: 'Comida', icon: 'pizza' },
    { name: 'Otros', icon: 'ellipsis-horizontal' },
  ];
  

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  get isFormInvalid() {
    const availableDays = this.form.get('availableDays')?.value;
    const startTime = this.form.get('startTime')?.value;
    const endTime = this.form.get('endTime')?.value;
    return !(availableDays && availableDays.length > 0 && startTime && endTime && startTime < endTime);
  }

  get isAddBlockDisabled() {
    const blockDays = this.form.get('blockDays')?.value;
    const blockStartTime = this.form.get('blockStartTime')?.value;
    const blockEndTime = this.form.get('blockEndTime')?.value;
    return !(blockDays && blockDays.length > 0 && blockStartTime && blockEndTime && blockStartTime < blockEndTime);
  }

  addBlockedTimeSlot() {
    const blockDays = this.form.get('blockDays')?.value;
    const blockStartTime = this.form.get('blockStartTime')?.value;
    const blockEndTime = this.form.get('blockEndTime')?.value;
    const reason = this.form.get('reason')?.value;

    if (blockDays && blockDays.length > 0 && blockStartTime && blockEndTime) {
      this.blockedTimeSlots.push({
        days: blockDays,
        startTime: blockStartTime,
        endTime: blockEndTime,
        reason: reason || 'Sin motivo',
      });

      this.form.patchValue({
        blockDays: [],
        blockStartTime: '',
        blockEndTime: '',
        reason: '',
      });
    }
  }

  removeBlockedTimeSlot(index: number) {
    this.blockedTimeSlots.splice(index, 1);
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

  async submit() {
    if (this.form.invalid) {
      this.utilsSvc.presentToast({
        message: 'Debe completar todos los campos obligatorios.',
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

    const data: Service = {
      id,
      name: this.form.get('name')?.value,
      category: this.form.get('category')?.value,
      description: this.form.get('description')?.value,
      imageUrl: this.localImage || this.defaultImageUrl,
      ownerId: user.uid,
      availableDays: this.form.get('availableDays')?.value,
      availableHours: [
        {
          days: this.form.get('availableDays')?.value,
          startTime: this.form.get('startTime')?.value,
          endTime: this.form.get('endTime')?.value,
        },
      ],
      blockedTimeSlots: this.blockedTimeSlots,
      createdAt: timestamp,
      updatedAt: timestamp,
      offers: [],
    };

    try {
      if (this.imageFile) {
        const filePath = `service-images/${user.uid}/service-${id}.jpg`;
        const imageUrl = await this.firebaseSvc.uploadImage(filePath, this.imageFile);
        data.imageUrl = imageUrl;
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
