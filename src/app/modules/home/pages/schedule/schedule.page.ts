import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Service, Offer } from 'src/app/models/service.model';
import { Booking } from 'src/app/models/booking.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  service: Service;
  offer: Offer;
  selectedDate: string;
  today: string = new Date().toISOString().split('T')[0];
  maxDate: string;
  availableTimes: { label: string; startTime: string; available: boolean; selected?: boolean }[] = [];
  selectedTime: { label: string; startTime: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private navCtrl: NavController,
  ) {}

  async ngOnInit() {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    this.maxDate = date.toISOString().split('T')[0];

    const serviceId = this.route.snapshot.paramMap.get('serviceId');
    const offerId = this.route.snapshot.paramMap.get('offerId');

    if (serviceId && offerId) {
      await this.loadService(serviceId, offerId);
    }
  }

  async loadService(serviceId: string, offerId: string) {
    try {
      this.service = (await this.firebaseSvc.getDocument(`services/${serviceId}`)) as Service;
      this.offer = this.service.offers.find((offer) => offer.id === offerId);

      if (!this.offer) {
        throw new Error('Oferta no encontrada.');
      }
    } catch (error) {
      console.error('Error al cargar el servicio:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar el servicio u oferta.',
        color: 'danger',
      });
    }
  }

  async updateAvailability() {
    if (!this.service || !this.selectedDate || !this.offer) return;

    // Normalizar la fecha seleccionada al formato 'YYYY-MM-DD'
    this.selectedDate = new Date(this.selectedDate).toISOString().split('T')[0];

    const startTime = this.service.availableHours[0]?.startTime || '09:00';
    const endTime = this.service.availableHours[0]?.endTime || '18:00';
    const duration = this.offer.duration;

    // Cargar bookings existentes para la fecha y servicio seleccionados
    const bookings = await this.loadBookingsForDate(this.selectedDate);

    this.availableTimes = this.calculateTimeBlocks(startTime, endTime, duration, this.selectedDate, bookings);
    this.selectedTime = null; // Reiniciar la selección cuando se actualice la disponibilidad
  }

  calculateTimeBlocks(
    startTime: string,
    endTime: string,
    duration: number,
    selectedDate: string,
    bookings: Booking[]
  ): { label: string; startTime: string; available: boolean; selected?: boolean }[] {
    console.log('Bookings para la fecha seleccionada:', bookings);
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    const slots = [];

    let current = new Date(start);

    while (current < end) {
      const next = new Date(current.getTime() + duration * 60000);
      if (next > end) break;

      const slotStart = this.formatTime(current);
      const slotEnd = this.formatTime(next);

      const isBooked = bookings.some(
        (booking) => booking.startTime === slotStart
      );

      console.log(`Horario: ${slotStart} - Disponible: ${!isBooked}`);

      slots.push({
        label: `${slotStart} - ${slotEnd}`,
        startTime: slotStart,
        available: !isBooked,
      });

      current = next;
    }

    return slots;
  }

  onTimeSelected(time: { label: string; startTime: string; available: boolean; selected?: boolean }) {
    if (!time.available) return; // Ignorar si no está disponible
    this.availableTimes.forEach((t) => (t.selected = false)); // Desmarcar otros
    time.selected = true; // Marcar como seleccionado
    this.selectedTime = time; // Establecer como seleccionado
  }

  async scheduleService() {
    if (!this.selectedDate || !this.selectedTime) {
      this.utilsSvc.presentToast({
        message: 'Seleccione una fecha y hora disponibles.',
        color: 'danger',
      });
      return;
    }

    const booking: Booking = {
      id: this.firebaseSvc.createId(),
      serviceId: this.service.id,
      offerId: this.offer.id,
      userId: JSON.parse(localStorage.getItem('user')).uid,
      date: this.selectedDate, // Ya está normalizada
      startTime: this.selectedTime.startTime,
      endTime: this.addMinutes(this.selectedTime.startTime, this.offer.duration),
      status: 'pending',
    };

    try {
      await this.firebaseSvc.setDocument(`bookings/${booking.id}`, booking);
      this.utilsSvc.presentToast({
        message: 'Cita agendada con éxito.',
        color: 'success',
      });
    } catch (error) {
      console.error('Error al agendar la cita:', error);
      this.utilsSvc.presentToast({
        message: 'Error al agendar la cita.',
        color: 'danger',
      });
    }
  }

  parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  addMinutes(time: string, minutes: number): string {
    const date = this.parseTime(time);
    date.setMinutes(date.getMinutes() + minutes);
    return this.formatTime(date);
  }

  async loadBookingsForDate(date: string): Promise<Booking[]> {
    try {
        // Rango de inicio y fin del día en formato ISO para la consulta
        const startOfDay = new Date(date).toISOString().split('T')[0] + 'T00:00:00';
        const endOfDay = new Date(date).toISOString().split('T')[0] + 'T23:59:59';

        console.log('Rango de fechas aplicado:', { startOfDay, endOfDay });

        // Consulta con múltiples filtros
        const bookings = await this.firebaseSvc.getCollectionWithMultipleFilters<Booking>('bookings', [
            { field: 'date', operator: '>=', value: startOfDay },
            { field: 'date', operator: '<=', value: endOfDay },
            { field: 'serviceId', operator: '==', value: this.service.id },
        ]);

        console.log('Bookings cargados:', bookings);
        return bookings;
    } catch (error) {
        console.error('Error al cargar bookings:', error);
        return [];
    }
}

  
  goBack() {
    this.navCtrl.back();
  }
  
}
