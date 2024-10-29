import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScheduleModalComponent } from '../schedule-modal/schedule-modal.component';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss']
})
export class ServiceModalComponent {
  @Input() service: any;

  constructor(private modalController: ModalController) {}
  
  async openScheduleModal() {
    const modal = await this.modalController.create({
      component: ScheduleModalComponent,
      componentProps: { service: this.service } // Pasa el servicio aquí
    });
    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  toggleFavorite() {
    this.service.isFavorite = !this.service.isFavorite;
  }
}
