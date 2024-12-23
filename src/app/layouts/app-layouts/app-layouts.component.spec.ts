import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLayoutsComponent } from './app-layouts.component';

describe('AppLayoutsComponent', () => {
  let component: AppLayoutsComponent;
  let fixture: ComponentFixture<AppLayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppLayoutsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
