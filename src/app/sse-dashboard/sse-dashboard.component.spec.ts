import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SseDashboardComponent } from './sse-dashboard.component';

describe('SseDashboardComponent', () => {
  let component: SseDashboardComponent;
  let fixture: ComponentFixture<SseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SseDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
