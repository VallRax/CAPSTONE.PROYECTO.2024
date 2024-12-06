import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Booking } from 'src/app/models/booking.model';
import { Service, Offer } from 'src/app/models/service.model';
import { User } from 'src/app/models/user.model';

type BookingWithDetails = Booking & {
  service: Service;
  offer: Offer;
  provider: User;
};

@Component({
  selector: 'app-scheduled-services',
  templateUrl: './scheduled-services.page.html',
  styleUrls: ['./scheduled-services.page.scss'],
})
export class ScheduledServicesPage implements OnInit {
  bookings: BookingWithDetails[] = [];
  isLoading = true;

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
      this.isLoading = true;
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

      this.bookings = await Promise.all(
        userBookings.map(async (booking) => {
          // Obtener información del servicio
          const service = (await this.firebaseSvc.getDocument(`services/${booking.serviceId}`)) as Service;

          // Obtener información del proveedor (usuario de tipo service)
          const provider = (await this.firebaseSvc.getDocument(`users/${service.ownerId}`)) as User;

          // Obtener la oferta relacionada
          const offer = service.offers.find((o) => o.id === booking.offerId);

          return {
            ...booking,
            service,
            offer,
            provider,
          };
        })
      );
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar las reservas.',
        color: 'danger',
      });
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
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

  canCancelBooking(booking: BookingWithDetails): boolean {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const hoursDifference = (bookingDate.getTime() - now.getTime()) / 3600000;
    return booking.status === 'pending' && hoursDifference > 72;
  }

  async cancelBooking(bookingId: string) {
    try {
      await this.firebaseSvc.setDocument(`bookings/${bookingId}`, { status: 'cancelled' });
      this.bookings = this.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      this.utilsSvc.presentToast({
        message: 'La cita ha sido cancelada.',
        color: 'success',
      });
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      this.utilsSvc.presentToast({
        message: 'No se pudo cancelar la cita.',
        color: 'danger',
      });
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
