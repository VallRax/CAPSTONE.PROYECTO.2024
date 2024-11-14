import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileservisPage } from './profileservis.page';

describe('ProfileservisPage', () => {
  let component: ProfileservisPage;
  let fixture: ComponentFixture<ProfileservisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileservisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
