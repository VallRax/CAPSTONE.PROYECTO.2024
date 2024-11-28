import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
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
    duration: new FormControl(null, [Validators.required, Validators.min(0)])
  });

  serviceId: string | null = null; // ID del servicio al que pertenece la oferta

  constructor(
    private route: ActivatedRoute, // ActivatedRoute para obtener el parámetro de la URL
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    // Obtener el serviceId desde la URL
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (!this.serviceId) {
      console.error('El ID del servicio no fue proporcionado.');
      this.utilsSvc.presentToast({
        message: 'Error: No se pudo cargar el servicio.',
        duration: 3000,
        color: 'danger',
      });
      this.utilsSvc.routerLink('/service-home'); // Redirigir en caso de error
    }
  }

  getRandomImage() {
    const randomNum = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/600/400?random=${randomNum}`;
  }

  async submit() {
    if (!this.serviceId) {
      console.error('El ID del servicio no está definido.');
      return;
    }
  
    if (this.form.valid) {
      try {
        const id = this.firebaseSvc.createId(); // Generar ID único para la oferta
        const imageUrl = this.getRandomImage(); // Crear la imagen aleatoria
  
        // Crear objeto de oferta
        const offer: Offer = {
          id, // Asignar el ID generado
          name: this.form.controls.name.value,
          description: this.form.controls.description.value,
          price: this.form.controls.price.value,
          imageUrl,
          duration: this.form.controls.duration.value,
        };
  
        // Guardar la oferta dentro del servicio
        const path = `services/${this.serviceId}`;
        const service = await this.firebaseSvc.getDocument(path);
  
        // Asegurarse de que `offers` existe
        service['offers'] = service['offers'] || [];
        service['offers'].push(offer);
  
        // Actualizar el documento del servicio
        await this.firebaseSvc.setDocument(path, service);
  
        console.log('Oferta añadida con éxito');
        this.utilsSvc.routerLink(`/service-home/edit-service/${this.serviceId}`); // Redirigir al detalle del servicio
      } catch (error) {
        console.error('Error al añadir la oferta:', error);
      }
    }
  }
  
}
