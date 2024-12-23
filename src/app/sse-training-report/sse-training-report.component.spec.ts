import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SseTrainingReportComponent } from './sse-training-report.component';

describe('SseTrainingReportComponent', () => {
  let component: SseTrainingReportComponent;
  let fixture: ComponentFixture<SseTrainingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SseTrainingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SseTrainingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
