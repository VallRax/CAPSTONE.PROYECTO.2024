import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceModalComponent } from 'src/app/shared/components/service-modal/service-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  categories = [
    { name: 'Belleza', icon: 'cut-outline' },
    { name: 'Veterinaria', icon: 'paw-outline' },
    { name: 'Salud', icon: 'medkit-outline' },
    { name: 'Fitness', icon: 'barbell-outline' },
    
    { name: 'Otros', icon: 'ellipsis-horizontal-outline' },
  ];

  serviceImages = [
    { src: 'https://picsum.photos/600/400?random=1' },
    { src: 'https://picsum.photos/600/400?random=2' },
    { src: 'https://picsum.photos/600/400?random=3' },
  ];

  services = [
    {
      name: 'Spa Relajación Total',
      address: 'Calle El Bosque Norte 345, Las Condes, Santiago',
      image: 'https://picsum.photos/80',
      rating: '4.8 (120+)',
    },
    {
      name: 'Gimnasio Elite',
      address: 'Avenida Providencia 2150, Santiago',
      image: 'https://picsum.photos/80',
      rating: '4.7 (90+)',
    },
    {
      name: 'Clínica Dental Sonrisas',
      address: 'Paseo Ahumada 360, Santiago',
      image: 'https://picsum.photos/80',
      rating: '4.5 (60+)',
    },
  ];

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  selectCategory(category: any) {
    console.log(`Selected Category: ${category.name}`);
  }

  async goToServiceName(service: any) {
    const modal = await this.modalController.create({
      component: ServiceModalComponent,
      componentProps: { service }
    });
    return await modal.present();
  }
}
