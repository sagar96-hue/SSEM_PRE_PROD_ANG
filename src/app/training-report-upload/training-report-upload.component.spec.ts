import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingReportUploadComponent } from './training-report-upload.component';

describe('TrainingReportUploadComponent', () => {
  let component: TrainingReportUploadComponent;
  let fixture: ComponentFixture<TrainingReportUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingReportUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingReportUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
