import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjpPjpReportComponent } from './ajp-pjp-report.component';

describe('AjpPjpReportComponent', () => {
  let component: AjpPjpReportComponent;
  let fixture: ComponentFixture<AjpPjpReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjpPjpReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjpPjpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
