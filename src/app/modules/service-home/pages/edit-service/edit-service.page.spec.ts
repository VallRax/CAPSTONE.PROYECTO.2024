import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditServicePage } from './edit-service.page';

describe('EditServicePage', () => {
  let component: EditServicePage;
  let fixture: ComponentFixture<EditServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
