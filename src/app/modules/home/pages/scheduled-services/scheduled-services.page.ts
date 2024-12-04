import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Booking } from 'src/app/models/booking.model';
import { Service, Offer } from 'src/app/models/service.model';

@Component({
  selector: 'app-scheduled-services',
  templateUrl: './scheduled-services.page.html',
  styleUrls: ['./scheduled-services.page.scss'],
})
export class ScheduledServicesPage implements OnInit {
  bookings: {
    id: string;
    service: Service;
    offer: Offer;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
  }[] = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.loadBookings();
  }

  async loadBookings() {
    try {
      const localUser = this.utilsSvc.getFromLocalStorage('user');
      if (!localUser?.uid) {
        throw new Error('Usuario no autenticado.');
      }

      // Obtener las reservas del usuario
      const userBookings = await this.firebaseSvc.getCollectionWithFilter<Booking>(
        'bookings',
        'clientId',
        '==',
        localUser.uid
      );

      // Obtener detalles de servicios y ofertas
      this.bookings = await Promise.all(
        userBookings.map(async (booking) => {
          const service = (await this.firebaseSvc.getDocument(`services/${booking.serviceId}`)) as Service;
          const offer = service.offers.find((o) => o.id === booking.offerId);

          if (!offer) {
            console.warn(`La oferta con ID ${booking.offerId} no se encontró para el servicio ${booking.serviceId}`);
          }

          return {
            ...booking,
            service,
            offer,
          };
        })
      );
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
    }
  }

  // Método para determinar la clase CSS según el estado
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Método para traducir el estado a texto amigable
  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  }

  // Método para formatear la fecha a día - mes - año
  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  goBack() {
    this.navCtrl.back();
  }
}
