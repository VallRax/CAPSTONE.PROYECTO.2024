import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOfferPage } from './add-offer.page';

describe('AddOfferPage', () => {
  let component: AddOfferPage;
  let fixture: ComponentFixture<AddOfferPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
