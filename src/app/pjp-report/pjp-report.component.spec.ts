import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjpReportComponent } from './pjp-report.component';

describe('PjpReportComponent', () => {
  let component: PjpReportComponent;
  let fixture: ComponentFixture<PjpReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjpReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PjpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
