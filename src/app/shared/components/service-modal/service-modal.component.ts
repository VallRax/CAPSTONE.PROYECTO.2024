import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss']
})
export class ServiceModalComponent {
  @Input() service: any;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  toggleFavorite() {
    this.service.isFavorite = !this.service.isFavorite;
  }
}
