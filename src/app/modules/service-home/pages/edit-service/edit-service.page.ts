import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

  segmentValue = 'edit'; // Valor inicial del segmento

  blockedTimeSlots: { days: string[]; startTime: string; endTime: string; reason: string }[] = [];

  form: FormGroup;

  allDays = [
    { label: 'Lunes', value: 'monday' },
    { label: 'Martes', value: 'tuesday' },
    { label: 'Miércoles', value: 'wednesday' },
    { label: 'Jueves', value: 'thursday' },
    { label: 'Viernes', value: 'friday' },
    { label: 'Sábado', value: 'saturday' },
    { label: 'Domingo', value: 'sunday' },
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
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router // Para redirigir a otras páginas
  ) {
    this.form = new FormGroup({
      blockDays: new FormControl([], Validators.required),
      blockStartTime: new FormControl('', Validators.required),
      blockEndTime: new FormControl('', Validators.required),
      reason: new FormControl(''),
    });
  }

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
  
      // Inicializar blockedTimeSlots si es nulo o indefinido
      this.blockedTimeSlots = this.service.blockedTimeSlots || [];
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
              this.service[field] = data.value as Service[K];
              this.saveChanges();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async openCategoryEditAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Editar Categoría',
      cssClass: 'custom-alert', // Clase personalizada
      inputs: this.categories.map(category => ({
        type: 'radio',
        label: category.name,
        value: category.name,
        checked: category.name === this.service?.category,
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (this.service) {
              this.service.category = data;
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

  get availableStartTime(): string | null {
    return this.service?.availableHours?.[0]?.startTime || null;
  }

  get availableEndTime(): string | null {
    return this.service?.availableHours?.[0]?.endTime || null;
  }

  async editHours(type: 'startTime' | 'endTime') {
    const currentValue = type === 'startTime' ? this.availableStartTime : this.availableEndTime;
    const alert = await this.alertCtrl.create({
      header: `Editar ${type === 'startTime' ? 'Hora de Apertura' : 'Hora de Cierre'}`,
      inputs: [
        {
          name: type,
          type: 'time',
          value: currentValue,
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data[type] && this.service) {
              const availableHour = this.service.availableHours?.[0];
              if (availableHour) {
                availableHour[type] = data[type];
              } else {
                this.service.availableHours = [
                  { days: this.service.availableDays, startTime: '', endTime: '' },
                ];
                this.service.availableHours[0][type] = data[type];
              }
              this.saveChanges();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  get isAddBlockDisabled(): boolean {
    const blockDays = this.form.get('blockDays')?.value || [];
    const blockStartTime = this.form.get('blockStartTime')?.value || '';
    const blockEndTime = this.form.get('blockEndTime')?.value || '';
    const reason = this.form.get('reason')?.value || '';
  
    // Validar cada campo
    return (
      blockDays.length === 0 || // No hay días seleccionados
      !blockStartTime ||        // Hora de inicio vacía
      !blockEndTime ||          // Hora de fin vacía
      blockStartTime >= blockEndTime || // Hora de inicio >= hora de fin
      reason.trim() === ''      // Razón vacía
    );
  }
  

  addBlockedTimeSlot() {
    const blockDays = this.form.get('blockDays')?.value;
    const blockStartTime = this.form.get('blockStartTime')?.value;
    const blockEndTime = this.form.get('blockEndTime')?.value;
    const reason = this.form.get('reason')?.value?.trim();
  
    if (blockDays && blockDays.length > 0 && blockStartTime && blockEndTime && blockStartTime < blockEndTime && reason) {
      const newBlock = {
        days: blockDays,
        startTime: blockStartTime,
        endTime: blockEndTime,
        reason,
      };
  
      console.log('Añadiendo nuevo bloqueo:', newBlock);
  
      // Actualizar el arreglo local
      this.blockedTimeSlots.push(newBlock);
  
      // Actualizar el modelo del servicio
      if (this.service) {
        this.service.blockedTimeSlots = [...this.blockedTimeSlots];
      }
  
      // Guardar en Firebase
      this.saveChanges();
  
      // Resetear el formulario
      this.form.reset({
        blockDays: [],
        blockStartTime: '',
        blockEndTime: '',
        reason: '',
      });
  
      // Notificar éxito
      this.utilsSvc.presentToast({ message: 'Bloqueo añadido con éxito.', color: 'success' });
    } else {
      console.error('Error al añadir bloqueo. Datos incompletos o inválidos:', {
        blockDays,
        blockStartTime,
        blockEndTime,
        reason,
      });
      this.utilsSvc.presentToast({ message: 'Complete todos los campos correctamente.', color: 'danger' });
    }
  }
  

  removeBlockedTimeSlot(index: number) {
    this.blockedTimeSlots.splice(index, 1);
    this.service.blockedTimeSlots = this.blockedTimeSlots;
    this.saveChanges();
  }

  async saveChanges() {
    try {
      if (!this.serviceId || !this.service) {
        throw new Error('No se encontró el ID del servicio o el modelo del servicio es nulo.');
      }
  
      const path = `services/${this.serviceId}`;
      await this.firebaseSvc.setDocument(path, this.service);
  
      console.log('Cambios guardados en Firebase:', this.service);
      this.utilsSvc.presentToast({ message: 'Cambios guardados.', color: 'success' });
    } catch (error) {
      console.error('Error al guardar cambios en Firebase:', error);
      this.utilsSvc.presentToast({ message: 'Error al guardar cambios.', color: 'danger' });
    }
  }

  editOffer(offerId: string) {
    this.router.navigate(['/service-home/edit-offer', this.serviceId, offerId]);
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

  goBack() {
    this.navCtrl.back();
  }
}
