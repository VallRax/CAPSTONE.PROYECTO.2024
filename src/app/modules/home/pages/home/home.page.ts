import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceModalComponent } from 'src/app/shared/components/service-modal/service-modal.component';
import { CategoryModalComponent } from 'src/app/shared/components/category-modal/category-modal.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class homePage {

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

  getRandomImage() {
    const randomNum = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/600/400?random=${randomNum}`;
  }

  services = [
    {
      name: 'Glamour Nails Studio',
      category: 'Belleza',
      description: "Ofrecemos tratamientos de belleza para uñas, manicura y pedicura profesional.",
      image: this.getRandomImage(),
      isFavorite: false,
      offers: [
        { name: 'Manicure Básico', description: 'Un tratamiento básico para el cuidado de tus uñas.', price: '$10.000', image: this.getRandomImage() },
        { name: 'Pedicure Completo', description: 'Incluye hidratación y esmaltado.', price: '$15.000', image: this.getRandomImage() },
        { name: 'Manicure Gel', description: 'Esmaltado en gel para una mayor duración.', price: '$12.000', image: this.getRandomImage() }
      ]
    },
    {
      name: 'Gimnasio Elite',
      category: 'Fitness',
      description: "Un gimnasio de primera clase para todos tus objetivos de fitness.",
      image: this.getRandomImage(),
      isFavorite: true,
      offers: [
        { name: 'Entrenamiento Personal', description: 'Sesión con entrenador personal.', price: '$20.000', image: this.getRandomImage() },
        { name: 'Clases de Yoga', description: 'Clases grupales de yoga.', price: '$8.000', image: this.getRandomImage() },
        { name: 'Clases de Spinning', description: 'Entrenamiento cardiovascular en bicicleta.', price: '$10.000', image: this.getRandomImage() }
      ]
    },
    {
      name: 'Clínica Dental Sonrisas',
      category: 'Salud',
      description: "Especialistas en el cuidado de tu sonrisa, con tratamientos personalizados.",
      image: this.getRandomImage(),
      isFavorite: false,
      offers: [
        { name: 'Limpieza Dental', description: 'Elimina el sarro y manchas de los dientes.', price: '$15.000', image: this.getRandomImage() },
        { name: 'Blanqueamiento Dental', description: 'Blanqueamiento seguro y efectivo.', price: '$30.000', image: this.getRandomImage() },
        { name: 'Ortodoncia', description: 'Tratamiento de corrección dental.', price: '$40.000', image: this.getRandomImage() }
      ]
    },
    {
      name: 'PetCare Veterinaria',
      category: 'Veterinaria',
      description: "Cuidados integrales para tu mascota con profesionales altamente capacitados.",
      image: this.getRandomImage(),
      isFavorite: false,
      offers: [
        { name: 'Consulta Veterinaria', description: 'Chequeo general para tu mascota.', price: '$20.000', image: this.getRandomImage() },
        { name: 'Vacunación', description: 'Vacunas completas para perros y gatos.', price: '$15.000', image: this.getRandomImage() },
        { name: 'Baño y Peluquería', description: 'Aseo completo y corte de pelo.', price: '$10.000', image: this.getRandomImage() }
      ]
    },
    {
      name: 'Limpieza Hogar 24/7',
      category: 'Hogar',
      description: "Servicios de limpieza profesional para tu hogar u oficina.",
      image: this.getRandomImage(),
      isFavorite: true,
      offers: [
        { name: 'Limpieza Básica', description: 'Limpieza superficial de las áreas principales.', price: '$18.000', image: this.getRandomImage() },
        { name: 'Limpieza Profunda', description: 'Limpieza completa y detallada.', price: '$30.000', image: this.getRandomImage() },
        { name: 'Desinfección', description: 'Elimina gérmenes y bacterias en el hogar.', price: '$25.000', image: this.getRandomImage() }
      ]
    },
    {
      name: 'TechFix Soluciones',
      category: 'Tecnología',
      description: "Reparación y mantenimiento de dispositivos tecnológicos.",
      image: this.getRandomImage(),
      isFavorite: false,
      offers: [
        { name: 'Reparación de Pantalla', description: 'Cambio de pantalla para smartphones.', price: '$50.000', image: this.getRandomImage() },
        { name: 'Formateo de PC', description: 'Formateo e instalación de software.', price: '$20.000', image: this.getRandomImage() },
        { name: 'Limpieza de Virus', description: 'Eliminación de virus y malware.', price: '$15.000', image: this.getRandomImage() }
      ]
    },
    {
      name: 'PizzaManía',
      category: 'Comida',
      description: "Las mejores pizzas artesanales hechas con ingredientes frescos.",
      image: this.getRandomImage(),
      isFavorite: true,
      offers: [
        { name: 'Pizza Margarita', description: 'Pizza con tomate, mozzarella y albahaca.', price: '$8.000', image: this.getRandomImage() },
        { name: 'Pizza Pepperoni', description: 'Pizza con pepperoni y extra queso.', price: '$9.000', image: this.getRandomImage() },
        { name: 'Pizza Veggie', description: 'Pizza con vegetales frescos.', price: '$10.000', image: this.getRandomImage() }
      ]
    }
  ];

  constructor(private modalController: ModalController) {}

  async openCategoryModal(category: any) {
    const servicesInCategory = this.services.filter(service => service.category === category.name);
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
      componentProps: { category: { ...category, services: servicesInCategory } }
    });
    return await modal.present();
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

  // loadAllServices() {
  //   const path = `services`;
  //   this.firebaseSvc.getCollection(path).then((data: Service[]) => {
  //     this.services = data; // Mostrar todos los servicios
  //     console.log('Todos los servicios:', this.services);
  //   }).catch((error) => {
  //     console.error('Error al cargar servicios:', error);
  //   });
  // }
  
}
