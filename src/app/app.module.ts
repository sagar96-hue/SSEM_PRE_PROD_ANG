import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { FormsModule } from '@angular/forms';
import { TrainingDeliveryReportComponent } from './training-delivery-report/training-delivery-report.component';
import { SseTrainingReportComponent } from './sse-training-report/sse-training-report.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SseDashboardComponent } from './sse-dashboard/sse-dashboard.component';
import { ModalComponent } from './modal/modal.component';

import { DialogBodyComponent } from './dialog-body/dialog-body.component';

import { AjpPjpReportComponent } from './ajp-pjp-report/ajp-pjp-report.component';
import { PreJourneyPlanComponent } from './pre-journey-plan/pre-journey-plan.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { PjpReportComponent } from './pjp-report/pjp-report.component';
import { AppLayoutsComponent } from './layouts/app-layouts/app-layouts.component'
import { NgxSimpleTextEditorModule } from 'ngx-simple-text-editor';
import { OnlyNumberDirective } from './Directives/only-number.directive';

import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './Auth/auth.interceptor';
import { LogoutComponent } from './logout/logout.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TrainingReportUploadComponent } from './training-report-upload/training-report-upload.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    TrainingDeliveryReportComponent,
    SseTrainingReportComponent,
    HeaderComponent,
    SidebarComponent,
    SseDashboardComponent,
    ModalComponent,

    DialogBodyComponent,
    AjpPjpReportComponent,
    PreJourneyPlanComponent,

    PjpReportComponent,
    AppLayoutsComponent,
    OnlyNumberDirective,
    LogoutComponent,
    LandingPageComponent,
    TrainingReportUploadComponent

  ],
  imports: [
    FormsModule,

    AppRoutingModule,
    NgSelectModule,

    HttpClientModule,

    BrowserModule,
    BrowserAnimationsModule,
    NgxSimpleTextEditorModule,

    NgbDatepickerModule

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
