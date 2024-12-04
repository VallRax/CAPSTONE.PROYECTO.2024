import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Service } from 'src/app/models/service.model';

import { TestDataService } from 'src/app/core/services/test-data.service';

@Component({
  selector: 'app-service-home',
  templateUrl: './service-home.page.html',
  styleUrls: ['./service-home.page.scss'],
})
export class ServiceHomePage implements OnInit {
  services: Service[] = []; // Usar el modelo de servicio

  constructor(
    private testDataService: TestDataService,
    private firebaseSvc: FirebaseService
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    const user = JSON.parse(localStorage.getItem('user'));
    const path = `services`; // Colección global
    this.firebaseSvc.getCollection(path).then((data: Service[]) => {
      this.services = data.filter(service => service.ownerId === user.uid); // Filtrar por UID del proveedor
      console.log('Servicios cargados:', this.services);
    }).catch((error) => {
      console.error('Error al cargar servicios:', error);
    });
  }
  

  deleteService(id: string) {
    const path = `services/${id}`;
    this.firebaseSvc.deleteDocument(path).then(() => {
      console.log('Servicio eliminado');
      this.loadServices(); // Recargar lista después de eliminar
    }).catch((error) => {
      console.error('Error al eliminar el servicio:', error);
    });
  }

  async generateTestData() {
    try {
      await this.testDataService.generateTestData();
      console.log('Datos de prueba generados con éxito.');
      alert('Datos de prueba generados correctamente.');
    } catch (error) {
      console.error('Error al generar datos de prueba:', error);
      alert('Error al generar datos de prueba.');
    }
  }
}
