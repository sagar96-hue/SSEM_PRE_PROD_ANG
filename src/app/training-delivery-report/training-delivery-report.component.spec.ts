import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDeliveryReportComponent } from './training-delivery-report.component';

describe('TrainingDeliveryReportComponent', () => {
  let component: TrainingDeliveryReportComponent;
  let fixture: ComponentFixture<TrainingDeliveryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingDeliveryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingDeliveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
