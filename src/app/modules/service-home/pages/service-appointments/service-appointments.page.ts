import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Booking } from 'src/app/models/booking.model';
import { Service } from 'src/app/models/service.model';

@Component({
  selector: 'app-service-appointments',
  templateUrl: './service-appointments.page.html',
  styleUrls: ['./service-appointments.page.scss'],
})
export class ServiceAppointmentsPage implements OnInit {
  servicesWithBookings: {
    id: string;
    name: string;
    category: string;
    bookings: Booking[];
  }[] = [];
  isLoading = true; // Control de la rueda de carga

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.loadServicesWithBookings();
  }

  async loadServicesWithBookings() {
    try {
      this.isLoading = true; // Mostrar la rueda de carga
      const localUser = this.utilsSvc.getFromLocalStorage('user');
      if (!localUser?.uid) throw new Error('Usuario no autenticado.');

      const services = await this.firebaseSvc.getCollectionWithFilter<Service>(
        'services',
        'ownerId',
        '==',
        localUser.uid
      );

      const servicesWithBookings = await Promise.all(
        services.map(async (service) => {
          const bookings = await this.firebaseSvc.getCollectionWithFilter<Booking>(
            'bookings',
            'serviceId',
            '==',
            service.id
          );

          const enrichedBookings = await Promise.all(
            bookings.map(async (booking) => {
              const client = await this.firebaseSvc.getDocument(`users/${booking.clientId}`);
              return {
                ...booking,
                clientName: client['name'],
                clientLastName: client['lastName'],
                clientRut: client['rut'],
              };
            })
          );

          return { ...service, bookings: enrichedBookings };
        })
      );

      this.servicesWithBookings = servicesWithBookings.filter(
        (service) => service.bookings.length > 0
      );
    } catch (error) {
      console.error('Error al cargar servicios con reservas:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar los servicios con reservas.',
        color: 'danger',
      });
    } finally {
      this.isLoading = false; // Ocultar la rueda de carga
    }
  }

  canModifyStatus(booking: Booking): boolean {
    return booking.status !== 'cancelled';
  }

  canCancelBooking(booking: Booking): boolean {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const hoursDifference = (bookingDate.getTime() - now.getTime()) / 3600000;
    return booking.status === 'pending' && hoursDifference > 72;
  }

  canFinalizeBooking(booking: Booking): boolean {
    const now = new Date();
    const bookingEndDate = new Date(`${booking.date}T${booking.endTime}`);
    return booking.status === 'confirmed' && now > bookingEndDate;
  }

  async updateBookingStatus(serviceId: string, booking: Booking, event: any) {
    const newStatus = event.detail.value;
    try {
      const bookingPath = `bookings/${booking.id}`;
      await this.firebaseSvc.setDocument(bookingPath, {
        ...booking,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      booking.status = newStatus;

      this.utilsSvc.presentToast({
        message: 'Estado de la cita actualizado.',
        color: 'success',
      });
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      this.utilsSvc.presentToast({
        message: 'No se pudo actualizar el estado de la cita.',
        color: 'danger',
      });
    }
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'finalized':
        return 'Finalizada';
      default:
        return 'Desconocido';
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
