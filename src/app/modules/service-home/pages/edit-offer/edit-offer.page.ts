import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Offer } from 'src/app/models/service.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  offer: Offer | null = null;
  serviceId: string;
  offerId: string;

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId')!;
    this.offerId = this.route.snapshot.paramMap.get('offerId')!;
    if (!this.serviceId || !this.offerId) {
      this.utilsSvc.presentToast({
        message: 'Error: Datos insuficientes para cargar la oferta.',
        color: 'danger',
      });
      this.navCtrl.back();
      return;
    }
    this.loadOffer();
  }

  async loadOffer() {
    try {
      const path = `services/${this.serviceId}`;
      const service = await this.firebaseSvc.getDocument(path);
      const offers: Offer[] = service?.['offers'] || [];
      this.offer = offers.find((o) => o.id === this.offerId);

      if (!this.offer) {
        throw new Error('La oferta no existe.');
      }
    } catch (error) {
      console.error('Error al cargar la oferta:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar la oferta.',
        color: 'danger',
      });
      this.navCtrl.back();
    }
  }

  async openEditAlert(field: keyof Offer, currentValue: string | number) {
    const alert = await this.alertCtrl.create({
      header: `Editar ${field}`,
      inputs: [
        {
          name: 'value',
          type: field === 'description' || field === 'imageUrl' ? 'text' : 'textarea',
          placeholder: `Editar ${field}`,
          value: currentValue.toString(),
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

  async updateField(field: keyof Offer, value: any) {
    if (!this.offer || !this.serviceId) return;

    this.offer[field] = value as never;

    try {
      const path = `services/${this.serviceId}`;
      const service = await this.firebaseSvc.getDocument(path);
      const offers = service?.['offers'] || [];
      const offerIndex = offers.findIndex((o: Offer) => o.id === this.offerId);

      if (offerIndex !== -1) {
        offers[offerIndex] = { ...this.offer };
        await this.firebaseSvc.setDocument(path, { ...service, offers });
        this.utilsSvc.presentToast({
          message: 'Oferta actualizada con éxito.',
          color: 'success',
        });
      }
    } catch (error) {
      console.error('Error al actualizar la oferta:', error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar la oferta.',
        color: 'danger',
      });
    }
  }

  async deleteOffer() {
    if (!this.serviceId || !this.offerId) return;

    try {
      const path = `services/${this.serviceId}`;
      const service = await this.firebaseSvc.getDocument(path);
      const updatedOffers = service?.['offers'].filter((o: Offer) => o.id !== this.offerId);

      await this.firebaseSvc.setDocument(path, { ...service, offers: updatedOffers });
      this.utilsSvc.presentToast({
        message: 'Oferta eliminada con éxito.',
        color: 'success',
      });
      this.navCtrl.back();
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
