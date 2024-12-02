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

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService, private navCtrl: NavController) {}

  async ngOnInit() {
    await this.loadBookings();
  }

  async loadBookings() {
    try {
      const localUser = this.utilsSvc.getFromLocalStorage('user');
      if (!localUser?.uid) {
        throw new Error('Usuario no autenticado');
      }

      // Cargar las reservas del usuario
      const userBookings = await this.firebaseSvc.getCollectionWithFilter<Booking>(
        'bookings',
        'userId',
        '==',
        localUser.uid
      );

      // Cargar los detalles de cada servicio y oferta
      this.bookings = await Promise.all(
        userBookings.map(async (booking) => {
          const service = await this.firebaseSvc.getDocument(`services/${booking.serviceId}`) as Service;
          const offer = service.offers.find((o) => o.id === booking.offerId);
          return { ...booking, service, offer };
        })
      );
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
    }
  }

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

  goBack() {
    this.navCtrl.back();
  }
}
