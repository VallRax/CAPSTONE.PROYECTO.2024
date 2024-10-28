import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceModalComponent } from 'src/app/shared/components/service-modal/service-modal.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})

export class LobbyPage {


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

  services = [
    {
      name: 'Glamour Nails Studio',
      category: 'Belleza',
      description: "Here's a small text description for the card content. Nothing more, nothing less.",
      image: 'https://picsum.photos/600/400?random=1',
      isFavorite: false,
    },
    {
      name: 'Gimnasio Elite',
      category: 'Fitness',
      description: "Un gimnasio de primera clase para todos tus objetivos de fitness.",
      image: 'https://picsum.photos/600/400?random=2',
      isFavorite: true,
    },
    {
      name: 'Clínica Dental Sonrisas',
      category: 'Salud',
      description: "Especialistas en el cuidado de tu sonrisa, con tratamientos personalizados.",
      image: 'https://picsum.photos/600/400?random=3',
      isFavorite: false,
    },
    {
      name: 'PetCare Veterinaria',
      category: 'Veterinaria',
      description: "Cuidados integrales para tu mascota con profesionales altamente capacitados.",
      image: 'https://picsum.photos/600/400?random=4',
      isFavorite: false,
    },
    {
      name: 'Limpieza Hogar 24/7',
      category: 'Hogar',
      description: "Servicios de limpieza profesional para tu hogar u oficina.",
      image: 'https://picsum.photos/600/400?random=5',
      isFavorite: true,
    },
    {
      name: 'TechFix Soluciones',
      category: 'Tecnología',
      description: "Reparación y mantenimiento de dispositivos tecnológicos.",
      image: 'https://picsum.photos/600/400?random=6',
      isFavorite: false,
    },
    {
      name: 'PizzaManía',
      category: 'Comida',
      description: "Las mejores pizzas artesanales hechas con ingredientes frescos.",
      image: 'https://picsum.photos/600/400?random=7',
      isFavorite: true,
    }
  ];

  constructor(private modalController: ModalController) {}

  async openServiceModal(service: any) {
    const modal = await this.modalController.create({
      component: ServiceModalComponent,
      componentProps: { service: service }
    });
    return await modal.present();
  }

  toggleFavorite(service: any) {
    service.isFavorite = !service.isFavorite;
  }
}
