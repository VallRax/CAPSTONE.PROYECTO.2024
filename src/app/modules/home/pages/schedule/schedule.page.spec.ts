import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchedulePage } from './schedule.page';

describe('SchedulePage', () => {
  let component: SchedulePage;
  let fixture: ComponentFixture<SchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
