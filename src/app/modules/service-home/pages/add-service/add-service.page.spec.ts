import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddServicePage } from './add-service.page';

describe('AddServicePage', () => {
  let component: AddServicePage;
  let fixture: ComponentFixture<AddServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
