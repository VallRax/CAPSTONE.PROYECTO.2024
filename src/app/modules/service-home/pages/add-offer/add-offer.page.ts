import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Offer } from 'src/app/models/service.model';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.page.html',
  styleUrls: ['./add-offer.page.scss'],
})
export class AddOfferPage {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    duration: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  serviceId: string | null = null; // ID del servicio al que pertenece la oferta
  imagePreview: string | null = null; // URL para la vista previa de la imagen
  imageFile: File | null = null; // Archivo de la imagen seleccionada
  userId: string | null = null; // ID del usuario autenticado

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  async ngOnInit() {
    // Obtener el `serviceId` desde la URL
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

    // Obtener el UID del usuario autenticado
    try {
      const user = await this.firebaseSvc.getAuth().currentUser;
      if (user) {
        this.userId = user.uid;
      } else {
        throw new Error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al autenticar al usuario:', error);
      this.utilsSvc.presentToast({
        message: 'Por favor, inicia sesión para continuar.',
        duration: 3000,
        color: 'danger',
      });
      this.utilsSvc.routerLink('/auth'); // Redirigir al login
    }
  }

  // Método para seleccionar una imagen
  async selectImage() {
    try {
      const image = await this.utilsSvc.takePictureFromGallery();
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
  
      // Actualizar la vista previa y el archivo seleccionado
      this.imagePreview = image.dataUrl;
      this.imageFile = new File([blob], `offer-image-${Date.now()}.jpg`, { type: blob.type });
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      this.utilsSvc.presentToast({
        message: 'Error al seleccionar la imagen.',
        duration: 3000,
        color: 'danger',
      });
    }
  }
  
  
  

  // Método para guardar la oferta
  async submit() {
    // Validar que `serviceId` y `userId` estén definidos
    if (!this.serviceId || !this.userId) {
      console.error('El ID del servicio o el usuario no está definido.');
      this.utilsSvc.presentToast({
        message: 'Error: No se pudo completar la operación. Intente nuevamente.',
        duration: 3000,
        color: 'danger',
      });
      return;
    }

    if (this.form.valid) {
      try {
        const id = this.firebaseSvc.createId(); // Generar ID único para la oferta
        let imageUrl: string;

        // Si hay una imagen seleccionada, súbela a Firebase Storage
        if (this.imageFile) {
          const imagePath = `offer-images/${this.userId}/offer-${id}.jpg`;
          imageUrl = await this.firebaseSvc.uploadImage(imagePath, this.imageFile);
        } else {
          // Si no hay una imagen seleccionada, usa la imagen predeterminada
          const servicePath = `services/${this.serviceId}`;
          const service = await this.firebaseSvc.getDocument(servicePath);
          imageUrl = service['imageUrl'] || 'assets/no-image.jpg';
        }

        // Crear objeto de oferta
        const offer: Offer = {
          id, // Asignar el ID generado
          name: this.form.controls.name.value,
          description: this.form.controls.description.value,
          price: this.form.controls.price.value,
          duration: this.form.controls.duration.value,
          imageUrl, // URL de la imagen
        };

        // Guardar la oferta dentro del servicio
        const path = `services/${this.serviceId}`;
        const service = await this.firebaseSvc.getDocument(path);

        // Asegurarse de que `offers` exista
        service['offers'] = service['offers'] || [];
        service['offers'].push(offer);

        // Actualizar el documento del servicio
        await this.firebaseSvc.setDocument(path, service);

        console.log('Oferta añadida con éxito');
        this.utilsSvc.presentToast({
          message: 'Oferta añadida con éxito.',
          duration: 3000,
          color: 'success',
        });
        this.utilsSvc.routerLink(`/service-home/edit-service/${this.serviceId}`); // Redirigir al detalle del servicio
        setTimeout(() => {
          window.location.reload(); // Forzar recarga
        }, 500);
      } catch (error) {
        console.error('Error al añadir la oferta:', error);
        this.utilsSvc.presentToast({
          message: 'Error al añadir la oferta.',
          duration: 3000,
          color: 'danger',
        });
      }
    } else {
      this.utilsSvc.presentToast({
        message: 'Complete todos los campos.',
        duration: 3000,
        color: 'danger',
      });
    }
  }

  goBack() {
    this.utilsSvc.routerLink('/service-home');
  }
}
