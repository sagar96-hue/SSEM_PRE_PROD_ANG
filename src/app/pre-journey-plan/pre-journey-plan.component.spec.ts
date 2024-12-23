import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreJourneyPlanComponent } from './pre-journey-plan.component';

describe('PreJourneyPlanComponent', () => {
  let component: PreJourneyPlanComponent;
  let fixture: ComponentFixture<PreJourneyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreJourneyPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreJourneyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
