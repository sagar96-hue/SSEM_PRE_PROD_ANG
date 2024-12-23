import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../Services/common.service';
import { ReportsService } from '../Services/reports.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-journey-plan',
  templateUrl: './pre-journey-plan.component.html',
  styleUrls: ['./pre-journey-plan.component.scss']
})
export class PreJourneyPlanComponent implements OnInit {
  @ViewChild('cancel', { static: false }) cancelButton!: ElementRef;
  @ViewChild('cancel1', { static: false }) cancelButton1!: ElementRef;
  @ViewChild('alert', { static: false }) alertButton!: ElementRef;
  constructor(private commonService: CommonService,
    private reportService: ReportsService,
    private router: Router

  ) { }
  isLoader:boolean=false
  dropdownDates: any;
  totalDays = 0
  selectedDateObj: any
  daysArr: any = [];
  trainingCodes: any;
  isSubmitted: boolean = false
  isDisableByWDay: boolean = false;
  pjpEventModel = {
    "Id": 0,
    "MonthAndYear": "",
    "Date": "",
    "Day": "",
    "TrainingMedium": "",
    "TrainingCode": "",
    "TrainingAudience": "",
    "ExpectedAudienceCount": 0
  }
  pjpEvent = {
    "pjP_ID": 0,
    "pjP_DATE": "",
    "traininG_MEDIUM": "",
    "traininG_CODE": "",
    "expecteD_AUDIENCE_COUNT": 0,
    "traininG_AUDIENCE": "",
    "traineR_ID": ""
  }
  userId: string | undefined | null
  trainingMediums: any;
  trainingAudience: any;
  pJPReport: any;
  public isMenu: boolean = false
  toBeDeletedId: any;
  alertMessage!: string 
  dateOfJoining:any
  isNewJoinee:boolean = false
  ngOnInit(): void {

    if (sessionStorage.getItem("DesignationID") == '202' || sessionStorage.getItem("DesignationID") == '262') {
      this.router.navigateByUrl('/pjp-report')
    }
    this.dateOfJoining = sessionStorage.getItem('DateOfJoining')
    let doj = new Date(Date.parse(this.dateOfJoining))
     var days = this.calculateDiff(doj)
     if(days<=7)
      this.isNewJoinee = true


    var currentMonth = new Date().getMonth() + 1;
    var nextMonth = currentMonth + 1;

    var currentYear = new Date().getFullYear();
    var nextYear = currentYear;
    if (currentMonth == 12) {
      nextMonth = 1
      nextYear = currentYear + 1;
    }
    else {
      nextMonth = currentMonth + 1;
    }

    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var mName = Months[1];
    this.dropdownDates = [
      { 'id': 1, 'date': Months[currentMonth - 1] + '-' + currentYear, 'year': currentYear, 'month': currentMonth },
      { 'id': 2, 'date': Months[nextMonth - 1] + '-' + nextYear, 'year': nextYear, 'month': nextMonth },

    ]

    this.getTrainingCode();
    this.getTrainingMedium();
    this.getTrainingAudience();


    var currentDate = new Date().getDay();
    
    this.userId = sessionStorage.getItem("UserEmpID")
  }

  daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  dateChange(dateObj: any) {

    this.daysArr = [];
    let selectedMonth = this.dropdownDates.find((b: { id: any; }) => b.id == dateObj).month
    let selectedYear = this.dropdownDates.find((b: { id: any; }) => b.id == dateObj).year

    let res: Date = new Date();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var dayName = days[res.getDay()];
    let cDate = ''
    this.totalDays = this.daysInMonth(selectedMonth, selectedYear);

    for (let index = 1; index <= this.totalDays; index++) {
      cDate = selectedMonth + '-' + index + '-' + selectedYear;
      var d = new Date(cDate);
      var dayName = days[d.getDay()];
      var obj = { 'date': cDate, 'day': dayName }
      this.daysArr.push(obj);
    }

    this.getPJPReport(this.daysArr[0].date);
    var currentDay = new Date().getDay();
    var currentMonth = new Date().getMonth()
    var lMonth = new Date(this.daysArr[0].date).getMonth()
    if (currentMonth == lMonth) {
      var workingDayCount = 0;
      if(!this.isNewJoinee)
      this.daysArr.forEach((element: any) => {

        if (workingDayCount <= 3) {
          var lDay = new Date(element.date).getDay()
         
          if (element.day != "Sunday" && element.day != "Saturday") {
            workingDayCount++
            if (workingDayCount > 3) {
              this.isDisableByWDay = true
              return;
            }
            if (currentDay == lDay) {
              this.isDisableByWDay = false
              workingDayCount++
              return;

            }
          }
        }

      })
    }
    else {
      this.isDisableByWDay = false
    }


  }

  showNewPjpEvent(data: any) {
    this.isSubmitted = false
    
    var monthYear = this.dropdownDates.find((x: { id: any; }) => x.id == this.selectedDateObj).date
    this.pjpEventModel.MonthAndYear = monthYear;
    this.pjpEventModel.Date = this.formatDate(data.date);
    this.pjpEventModel.Day = data.day;
    this.pjpEventModel.Id = 0;

    this.pjpEventModel.TrainingMedium = ""
    this.pjpEventModel.TrainingCode = ""
    this.pjpEventModel.TrainingAudience = ""
    this.pjpEventModel.ExpectedAudienceCount = 0
  }

  SavePjpEvent() {

    this.isSubmitted = true
    if (this.pjpEventModel.TrainingMedium == "" || this.pjpEventModel.TrainingCode == '' ||
      this.pjpEventModel.TrainingAudience == "" || this.pjpEventModel.ExpectedAudienceCount == null
    )
      return
    this.pjpEvent.pjP_ID = this.pjpEventModel.Id
    this.pjpEvent.pjP_DATE = this.pjpEventModel.Date
    this.pjpEvent.traininG_MEDIUM = this.pjpEventModel.TrainingMedium
    this.pjpEvent.traininG_CODE = this.pjpEventModel.TrainingCode
    this.pjpEvent.traininG_AUDIENCE = this.pjpEventModel.TrainingAudience
    this.pjpEvent.expecteD_AUDIENCE_COUNT = this.pjpEventModel.ExpectedAudienceCount

    
    if (this.pjpEvent.pjP_ID == 0) {
      this.reportService.SavePJPEvent(this.pjpEvent.pjP_ID, this.pjpEvent.pjP_DATE, this.pjpEvent.traininG_MEDIUM,
        this.pjpEvent.traininG_CODE, this.pjpEvent.traininG_AUDIENCE, this.pjpEvent.expecteD_AUDIENCE_COUNT, this.userId
      ).subscribe(data => {
        
        this.cancelButton.nativeElement.click()
        this.getPJPReport(this.daysArr[0].date);
      }, error => {

      })
    }
    else {
      this.reportService.UpdatePJPEvent(this.pjpEvent.pjP_ID, this.pjpEvent.pjP_DATE, this.pjpEvent.traininG_MEDIUM,
        this.pjpEvent.traininG_CODE, this.pjpEvent.traininG_AUDIENCE, this.pjpEvent.expecteD_AUDIENCE_COUNT, this.userId
      ).subscribe(data => {

        this.cancelButton.nativeElement.click()
        this.getPJPReport(this.daysArr[0].date);
      }, error => {

      })
    }

  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  getTrainingCode() {

    this.commonService.getTrainingCodes().subscribe(data => {

      this.trainingCodes = data;
    })
  }

  getTrainingMedium() {

    this.commonService.getTrainingMedium().subscribe(data => {
      this.trainingMediums = data;
    })
  }

  getTrainingAudience() {
    this.commonService.getTrainingAudience().subscribe(data => {

      this.trainingAudience = data;
    })
  }

  deletePJPEvent(pjP_ID: string) {
    this.reportService.DeletePJPReport(pjP_ID).subscribe(data => {


      this.cancelButton1.nativeElement.click()
      this.showAlert("Record has been deleted.")
  
      this.getPJPReport(this.daysArr[0].date);
    })
  }

  getPJPReport(date: string) {

    this.reportService.GetPJPReport(date, this.userId).subscribe(data => {

      
      this.pJPReport = data;
      

      this.pJPReport.forEach((element: any) => {

        element.TrainingMediumName = this.trainingMediums?.find
          ((x: any) => x.TRAINING_MEDIUM_ID == element.TRAINING_MEDIUM)?.TRAINING_MEDIUM_NAME

        element.TrainingCodeName = this.trainingCodes?.find
          ((x: any) => x.TRAINING_CODE_ID == element.TRAINING_CODE)?.TRAINING_CODE

        element.TrainingAudienceName = this.trainingAudience?.find
          ((x: any) => x.TRAINING_AUDIENCE_ID == element.TRAINING_AUDIENCE)?.TRAINING_AUDIENCE_NAME

        var dateArr = element.PJP_DATE.split('T')[0].split('-');
        var newDate = Number(dateArr[1]) + '-' + Number(dateArr[2]) + '-' + dateArr[0]

        element.ModifiedDate = newDate

      });
      
      this.daysArr.forEach((e: any) => {

        var checkRecord = this.pJPReport.find((x: any) => x.ModifiedDate == e.date)
        if (checkRecord == undefined)
          e.isHighLighted = true
        else
          e.isHighLighted = false
      })

    })
  }

  bindCreatePJPEvent(childData: any, parentData: any) {

    this.isSubmitted = false
    this.pjpEventModel.Id = childData.PJP_ID
    this.pjpEventModel.Date = childData.PJP_DATE
    this.pjpEventModel.TrainingMedium = childData.TRAINING_MEDIUM
    this.pjpEventModel.TrainingCode = childData.TRAINING_CODE
    this.pjpEventModel.TrainingAudience = childData.TRAINING_AUDIENCE
    this.pjpEventModel.ExpectedAudienceCount = childData.EXPECTED_AUDIENCE_COUNT

    var monthYear = this.dropdownDates.find((x: { id: any; }) => x.id == this.selectedDateObj).date
    this.pjpEventModel.MonthAndYear = monthYear;
    this.pjpEventModel.Date = this.formatDate(parentData.date);
    this.pjpEventModel.Day = parentData.day;
  }

  exportToExcel() {

    let excelData: any[] = [];

    this.daysArr.forEach((x: any) => {

      var dataToExport: {}
      var currentDateData = []
      currentDateData = this.pJPReport.filter((p: any) => p.ModifiedDate == x.date)
      if (currentDateData.length > 0) {
        currentDateData.forEach((y: any) => {
          if(x.date !="" && x.date != null && x.date!=undefined)
          {
            dataToExport = {
              "Date":new Date( x.date),
              "Day": x.day,
              "Training Medium": y.TrainingMediumName,
              "Training Code": y.TrainingCodeName,
              "Audience": y.TrainingAudienceName,
              "Expected Audience Count": y.EXPECTED_AUDIENCE_COUNT,
            }
  
            excelData.push(dataToExport);
          }
        
        })

      }
      else {
        dataToExport = {
          "Date": x.date,
          "Day": x.day,
          "Training Medium": "",
          "Training Code": "",
          "Audience": "",
          "Expected Audience Count": "",
        }

        excelData.push(dataToExport);
      }


    })

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'Current month PJP.xlsx');
  }


  setIdForDelete(id: any) {
    this.toBeDeletedId = id;
  }
  
  showAlert(message: string) {
    
    this.alertMessage = message
    this.alertButton.nativeElement.click();
  }

  calculateDiff(dateSent:any){
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
}
capitalizeFirstLetter(input: string): string {
  if (input.length === 0) return input; // Handle empty string

  return input.charAt(0).toUpperCase() + input.slice(1);
}
}
