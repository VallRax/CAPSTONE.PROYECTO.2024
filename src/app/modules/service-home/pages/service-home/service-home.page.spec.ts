import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceHomePage } from './service-home.page';

describe('ServiceHomePage', () => {
  let component: ServiceHomePage;
  let fixture: ComponentFixture<ServiceHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
