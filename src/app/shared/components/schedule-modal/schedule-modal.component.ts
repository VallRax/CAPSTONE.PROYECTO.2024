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
  selectedTime: string;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  scheduleService() {
    // Aquí puedes realizar la lógica para almacenar la cita o enviarla a la base de datos
    console.log('Fecha seleccionada:', this.selectedDate);
    console.log('Hora seleccionada:', this.selectedTime);
    alert(`Cita confirmada para ${this.selectedDate} a las ${this.selectedTime}`);
    this.dismiss();
  }
}
