import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduledServicesPage } from './scheduled-services.page';

describe('ScheduledServicesPage', () => {
  let component: ScheduledServicesPage;
  let fixture: ComponentFixture<ScheduledServicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
