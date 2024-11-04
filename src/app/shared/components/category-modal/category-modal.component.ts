import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceModalComponent } from '../service-modal/service-modal.component';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {
  @Input() category: any;
  servicesInCategory: any[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Filtra los servicios para la categoría seleccionada
    this.servicesInCategory = this.category?.services || [];
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openServiceModal(service: any) {
    const modal = await this.modalController.create({
      component: ServiceModalComponent,
      componentProps: { service }
    });
    return await modal.present();
  }

  toggleFavorite(service: any) {
    service.isFavorite = !service.isFavorite;
  }
}
