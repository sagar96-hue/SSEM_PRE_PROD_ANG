import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TrainingDeliveryReportComponent } from './training-delivery-report/training-delivery-report.component';
import { SseTrainingReportComponent } from './sse-training-report/sse-training-report.component';
import { SseDashboardComponent } from './sse-dashboard/sse-dashboard.component';
import { AjpPjpReportComponent } from './ajp-pjp-report/ajp-pjp-report.component';
import { PreJourneyPlanComponent } from './pre-journey-plan/pre-journey-plan.component';
import { PjpReportComponent } from './pjp-report/pjp-report.component';
import { AppLayoutsComponent } from './layouts/app-layouts/app-layouts.component';
import { AuthGuard } from './Auth/auth.guard';
import { LogoutComponent } from './logout/logout.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TrainingReportUploadComponent } from './training-report-upload/training-report-upload.component';



const routes: Routes = [

  {
    path: '', component: AppLayoutsComponent,
    canActivate: [AuthGuard],
    data: { title: 'full Views' },
    children: [
      {
        path: '',
        component: TrainingDeliveryReportComponent,

      },
      {
        path: 'training-delivery-report',
        component: TrainingDeliveryReportComponent
      },
      {
        path: 'sse-training-report',
        component: SseTrainingReportComponent
      },
      {
        path: 'sse-dashboard',
        component: SseDashboardComponent
      },
      {
        path: 'ajp-pjp-report',
        component: AjpPjpReportComponent
      },
      {
        path: 'pre-journey-plan',
        component: PreJourneyPlanComponent
      },

      {
        path: 'pjp-report',
        component: PjpReportComponent
      },

      {
        path: 'training-delivery-upload',
        component: TrainingReportUploadComponent
      },
    ]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'landing-page',
    component: LandingPageComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]

})
export class AppRoutingModule { }
