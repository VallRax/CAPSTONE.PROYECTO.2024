import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.scss']
})
export class ScheduleModalComponent {
  @Input() service: any;
  selectedDate: string;
  today: string = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
  maxDate: string; // Fecha máxima (6 meses en adelante)
  availableTimes = [
    { label: '09:00 AM', checked: false, available: true },
    { label: '10:00 AM', checked: false, available: true },
    { label: '11:00 AM', checked: false, available: true },
    { label: '01:00 PM', checked: false, available: true },
    { label: '02:00 PM', checked: false, available: true },
    { label: '03:00 PM', checked: false, available: true },
    { label: '04:00 PM', checked: false, available: true },
  ];

  constructor(private modalController: ModalController) {
    // Calcular la fecha máxima a 6 meses desde hoy
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    this.maxDate = date.toISOString().split('T')[0];

    // Generar disponibilidad inicial
    this.updateAvailability();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  scheduleService() {
    console.log("Cita agendada para", this.selectedDate);
  }

  selectTime(time) {
    if (!time.available) return; // Ignorar selección si no está disponible
    this.availableTimes.forEach(t => t.checked = false); // Desmarcar otros checkboxes
    time.checked = true; // Marcar el seleccionado
  }
  
  toggleTimeSelection(time) {
    this.selectTime(time); // Invocar selectTime para mantener la selección única
  }

  // Método para actualizar la disponibilidad de las horas
  updateAvailability() {
    this.availableTimes = this.availableTimes.map(time => ({
      ...time,
      available: Math.random() >= 0.5 // 50% de probabilidad de estar disponible
    }));
  }
}
