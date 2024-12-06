import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceAppointmentsPage } from './service-appointments.page';

describe('ServiceAppointmentsPage', () => {
  let component: ServiceAppointmentsPage;
  let fixture: ComponentFixture<ServiceAppointmentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAppointmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
