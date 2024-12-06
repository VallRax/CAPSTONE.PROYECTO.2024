import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router // Inyección del Router
  ) {}

  async ngOnInit() {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    this.maxDate = date.toISOString().split('T')[0];
  
    // Inicializa la fecha seleccionada con el valor actual (hoy)
    this.selectedDate = this.today;
  
    const serviceId = this.route.snapshot.paramMap.get('serviceId');
    const offerId = this.route.snapshot.paramMap.get('offerId');
  
    if (serviceId && offerId) {
      await this.loadService(serviceId, offerId);
  
      // Carga la disponibilidad inicial
      await this.updateAvailability();
    }
  }

  selectedDaySpanish: string;
  selectedDateFormatted: string;


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

  getDayInSpanish(date: Date): string {
    const daysInSpanish = [
      'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
    ];
    return daysInSpanish[date.getDay()];
  }
  
  getDayInEnglish(date: Date): string {
    const daysInEnglish = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    ];
    return daysInEnglish[date.getDay()];
  }
  

  async updateAvailability() {
    if (!this.service || !this.selectedDate || !this.offer) return;
  
    const selectedDateObj = new Date(this.selectedDate);
    this.selectedDate = selectedDateObj.toISOString().split('T')[0];
  
    // Obtén el nombre del día en español
    this.selectedDaySpanish = this.getDayInSpanish(selectedDateObj);
    const selectedDayEnglish = this.getDayInEnglish(selectedDateObj);

    // Formatea la fecha para mostrar en el subtítulo
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    this.selectedDateFormatted = selectedDateObj.toLocaleDateString('es-ES', options);
  
    if (!this.service.availableDays?.includes(selectedDayEnglish)) {
      this.availableTimes = [];
      this.utilsSvc.presentToast({
        message: `El servicio no está disponible el ${this.selectedDaySpanish}.`,
        color: 'warning',
      });
      return;
    }
  
    const hoursForDay = this.service.availableHours?.filter(hours =>
        hours.days.includes(selectedDayEnglish)
      );

  
    if (!hoursForDay || hoursForDay.length === 0) {
      this.availableTimes = [];
      this.utilsSvc.presentToast({
        message: `El servicio no tiene horarios configurados para el ${this.selectedDaySpanish}.`,
        color: 'warning',
      });
      return;
    }
  
    const bookings = await this.loadBookingsForDate(this.selectedDate);
    const isToday = this.selectedDate === this.today;
    const currentTime = isToday ? this.formatTime(new Date()) : null;
  
    this.availableTimes = [];
    for (const hours of hoursForDay) {
      const blocks = this.calculateTimeBlocks(
        hours.startTime,
        hours.endTime,
        this.offer.duration,
        this.selectedDate,
        bookings,
        currentTime
      );
      this.availableTimes.push(...blocks);
    }
  
    if (this.availableTimes.length === 0) {
      this.utilsSvc.presentToast({
        message: 'No hay horarios disponibles para el día seleccionado.',
        color: 'warning',
      });
    }
  
    this.selectedTime = null;
  }
  
  

  calculateTimeBlocks(
    startTime: string,
    endTime: string,
    duration: number,
    selectedDate: string,
    bookings: Booking[],
    currentTime?: string
  ): { label: string; startTime: string; available: boolean; selected?: boolean }[] {
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    const slots = [];

    let current = new Date(start);

    while (current < end) {
      const next = new Date(current.getTime() + duration * 60000);
      if (next > end) break;

      const slotStart = this.formatTime(current);
      const slotEnd = this.formatTime(next);

      const isBooked = bookings.some((booking) => booking.startTime === slotStart);
      const isPast = currentTime && this.selectedDate === this.today && slotStart < currentTime;

      slots.push({
        label: `${slotStart} - ${slotEnd}`,
        startTime: slotStart,
        available: !isBooked && !isPast,
      });

      current = next;
    }

    return slots;
  }

  onTimeSelected(time: { label: string; startTime: string; available: boolean; selected?: boolean }) {
    if (!time.available) return;
    this.availableTimes.forEach((t) => (t.selected = false));
    time.selected = true;
    this.selectedTime = time;
  }

  async scheduleService() {
    if (!this.selectedDate || !this.selectedTime) {
      this.utilsSvc.presentToast({
        message: 'Seleccione una fecha y hora disponibles.',
        color: 'danger',
      });
      return;
    }
  
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      this.utilsSvc.presentToast({
        message: 'Debe iniciar sesión para agendar un servicio.',
        color: 'warning',
      });
      return;
    }
  
    // Validar que ownerName esté definido
    const providerName = this.service.ownerName || 'Proveedor no especificado';
  
    const booking: Booking = {
      id: this.firebaseSvc.createId(),
      serviceId: this.service.id,
      offerId: this.offer.id,
      clientId: currentUser.uid,
      clientName: currentUser.name,
      providerId: this.service.ownerId,
      providerName: providerName, // Asignar un valor válido
      serviceName: this.service.name,
      date: this.selectedDate,
      startTime: this.selectedTime.startTime,
      endTime: this.addMinutes(this.selectedTime.startTime, this.offer.duration),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  
    try {
      await this.firebaseSvc.setDocument(`bookings/${booking.id}`, booking);
      this.utilsSvc.presentToast({
        message: 'Cita agendada con éxito.',
        color: 'success',
      });
      this.router.navigate(['/home/scheduled-services'], { replaceUrl: true }).then(() => {
        window.location.reload();
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
      const bookings = await this.firebaseSvc.getCollectionWithMultipleFilters<Booking>('bookings', [
        { field: 'date', operator: '==', value: date },
        { field: 'serviceId', operator: '==', value: this.service.id },
      ]);
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
