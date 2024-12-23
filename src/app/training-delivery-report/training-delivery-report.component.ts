import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TrainingDeliveryModel } from '../Models/DeliveryModel';
import { FormGroup } from '@angular/forms';
import { CommonService } from '../Services/common.service';
import { LoginService } from '../Services/login.service';
import { ReportsService } from '../Services/reports.service';
import * as XLSX from 'xlsx';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-training-delivery-report',
  templateUrl: './training-delivery-report.component.html',
  styleUrls: ['./training-delivery-report.component.scss']
})
export class TrainingDeliveryReportComponent implements OnInit {



  @ViewChild('alert', { static: false }) alertButton!: ElementRef;
  alertMessage!: string
  isLoader: boolean = false
  searchModel: any =
    {
      fromDate: '',
      toDate: '',
      branch: null,
      profile: null,
      trainingCode: []
    }

  fromDate: any
  toDate!: Date
  selectedBranch: any;
  selectedProfile: any;
  selectedTrainingCode: any;
  isSubmitted: boolean = false;
  constructor(
    private loginSerivce: LoginService,
    private commonService: CommonService,
    private reportService: ReportsService,
    private route: ActivatedRoute,
  ) {

  }
  branches: any = [
  ];
  profiles: any = [
  ]
  trainingCodes: any = [
  ]
  isMenu: boolean = false
  isFromDateValid: boolean = true
  isToDateValid: boolean = true
  userName: any
  userEmail: any
  //  maxDate="2018-08-28";
  // minFromDate! : NgbDate 
  minDate = { year: 1990, month: 1, day: 1 };
  // maxDate = {year: 2100, month: 1, day: 1};
  //minDate:'2016-08-28';
  DesignationID: any
  roleName: string = ''
  loggedInUserID: any
  userId!: string | null
  currentDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
  // currentDate={year:new Date().getDay,month:new Date().getMonth}
  // file!: File
  selectedFile: File | null = null;
  ngOnInit(): void {

    this.userId = sessionStorage.getItem("UserEmpID")
    this.DesignationID = sessionStorage.getItem("DesignationID");
    if (this.DesignationID == '202'||this.DesignationID == '262') {
      this.roleName = 'ADMIN'
    }
    else if (this.DesignationID == '122') {
      this.roleName = 'TRAINEE'
    }
    this.loggedInUserID = sessionStorage.getItem("UserId")
    this.getBranches();
    this.getProfiles();
    this.getTrainingCode();

  }
  search() {

    this.isSubmitted = true

    this.searchModel.branch = this.selectedBranch == undefined ? '' : this.selectedBranch?.join(",");
    // var allBranchCode  = this.branches.join(",")
    var allBranch = this.branches.map((item: { BRANCHID: any; }) => item.BRANCHID)
    .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)
    var allBranchId = allBranch.join(","); 

    var allProfile = this.profiles.map((item: { PROFILENAME: any; }) => item.PROFILENAME)
    .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)
    var allProfileName ="'"+ allProfile.join("','")+"'";
    
    var alltrainingCode =  this.trainingCodes.map((item: { TRAINING_CODE: any; }) => item.TRAINING_CODE)
    .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)
var allTrainingCodeName = "'"+alltrainingCode.join("','")+"'";

    this.searchModel.profile = (this.selectedProfile == undefined ? '' : this.selectedProfile?.join("','"));
    this.searchModel.trainingCode = (this.selectedTrainingCode == undefined ? '' : this.selectedTrainingCode?.join("','"));

    if (this.searchModel.branch == "" || this.searchModel.profile == "" || this.searchModel.trainingCode == ""
      || this.searchModel.fromDate == "" || this.searchModel.toDate == "" || !this.isFromDateValid || !this.isToDateValid
    ) {
      this.isSubmitted = true;
      return
    }
    if (this.searchModel.profile != "0") {
      this.searchModel.profile = "'" + this.searchModel.profile + "'"
    }
    if (this.searchModel.trainingCode != "0") {
      this.searchModel.trainingCode = "'" + this.searchModel.trainingCode + "'"
    }
    // this.searchModel.profile =="0"?"0":("'"+this.searchModel.profile+"'")
    this.isLoader = true
    this.reportService.GetTrainingDeliveryReport(this.searchModel.branch == "0"?allBranchId:this.searchModel.branch,
       this.searchModel.profile=="0"?allProfileName:this.searchModel.profile,
      this.searchModel.trainingCode =="0"?allTrainingCodeName:this.searchModel.trainingCode, this.convertToYYYYMMDD(this.searchModel.fromDate.replace('/', '-').replace('/', '-')),
      this.convertToYYYYMMDD(this.searchModel.toDate.replace('/', '-').replace('/', '-')), this.roleName, this.userId).subscribe(data => {
       
        this.isLoader = false
        if (data.length > 0) {

          this.ExportTOExcel(data)

         // this.resetForm()
        }
        else {
          this.showAlert("No data found.")
        }
      }, error => {
        
        this.isLoader = false
      })

  }
  getBranches() {

    this.commonService.getBranches(this.roleName, this.loggedInUserID).subscribe(data => {

      this.branches = data;
    }, error => {

    });

  }
  getProfiles() {
    this.commonService.getProfile().subscribe(data => {

      this.profiles = data;
    })
  }

  getTrainingCode() {
    this.commonService.getTrainingCodes().subscribe(data => {

      this.trainingCodes = data
    })
  }

  ExportTOExcel(data: any) {
    var nData = data.filter((x:any)=>!isNaN(x.ParticipantEmployeeId))
    var sData = data.filter((x:any)=>isNaN(x.ParticipantEmployeeId))
    var fData: any[] = []
    var nData1 = [...nData].sort((a,b)=>a.ParticipantEmployeeId-b.ParticipantEmployeeId)
    var sData1 = [...sData].sort((a,b)=>a.ParticipantEmployeeId.localeCompare(b.ParticipantEmployeeId))
    nData1.forEach((element:any) => {
      fData.push(element)
    });
    sData1.forEach((element:any) => {
      fData.push(element)
    });
data=fData
    //  var sortedData= [...data].sort((a, b) => a.ParticipantEmployeeId.localeCompare( b.ParticipantEmployeeId));
    //  data=sortedData;
    let excelData: any[] = [];

    data.forEach((x: any) => {
      var dataToExport: {}
      x.TrainingMedium = x.TrainingMedium[0]?.toUpperCase().trim()=="V"?"Virtual":x.TrainingMedium?.trim()
      x.TrainingMedium = x.TrainingMedium[0]?.toUpperCase().trim()=="C"?"Classroom":x.TrainingMedium?.trim()
      x.TrainingMedium = x.TrainingMedium[0]?.toUpperCase().trim()=="I"?"On-store":x.TrainingMedium?.trim()
      x.TrainingMedium = x.TrainingMedium[0]?.toUpperCase().trim()=="O"?"On-store":x.TrainingMedium?.trim()
      dataToExport = {
        "Year": x.Year,
        "Month": x.Month,
        "Trainer EmpId":isNaN(x.TrainerEmpId)?x.TrainerEmpId:  Number( x.TrainerEmpId),
        "Trainer Name": x.TrainerName,
        "Region Name": x.RegionName=="RO+UP"?"ROUP":x.RegionName,
        "Branch Code": x.BranchCode,
        "Participant Employee Id":isNaN(x.ParticipantEmployeeId)?x.ParticipantEmployeeId: Number( x.ParticipantEmployeeId),
        "Participant Name": x.ParticipantName,
        "Designation": x.Designation=="sse"?"SSE": x.Designation,
        "GTM Code": x.GTMCode,
        "Date Of Training":new Date( x.DateOfTraining),
        "Topic Covered": x.TopicCovered,
        "Training Code": x.TrainingCode,
        "Pre Score":Number( x.PreScore),
        "Post Score":Number( x.PostScore),
        // "Training Medium":this.titleCaseWord( x.TrainingMedium.trim()),
        "Training Medium":x.TrainingMedium,
        "Current Status": this.capitalizeFirstLetter(x.CurrentStatus),
        "Master Profile": this.getMasterProfile(x.Designation),
        "BPT Id": x.BPT_ID=="0"?"":x.BPT_ID,
        "BPT Name": x.BPT_Name=="-Select-"?"":x.BPT_Name

      }
      //i = i + 1;
      excelData.push(dataToExport);
    })

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'Training Delivery Report.xlsx');

    this.showAlert("Report has been downloaded")

  }

  getMasterProfile(designation:string){
    if( designation.toUpperCase()=="SSE" )
    {
      return "SSE"
    }
    else if(designation.toUpperCase()=="CHANNEL PARTNER")
    {
      return "Channel Partner"
    }
    else{
      return "Branch Sales Staff"
    }
   }

  branchChange(branch: any) {

    if (this.selectedBranch[this.selectedBranch.length - 1] == 0) {
      this.selectedBranch = []
      this.selectedBranch.push(branch[branch.length - 1])
    }
    else {
      if (this.selectedBranch[0] == 0) {
        this.selectedBranch = []
        this.selectedBranch.push(branch[branch.length - 1])
      }
    }

  }

  profileChange(profile: any) {

    if (this.selectedProfile[this.selectedProfile.length - 1] == 0) {
      this.selectedProfile = []
      this.selectedProfile.push(profile[profile.length - 1])
    }
    else {
      if (this.selectedProfile[0] == 0) {
        this.selectedProfile = []
        this.selectedProfile.push(profile[profile.length - 1])
      }
    }

  }

  trainingCodeChange(trainingCode: any) {

    if (this.selectedTrainingCode[this.selectedTrainingCode.length - 1] == 0) {
      this.selectedTrainingCode = []
      this.selectedTrainingCode.push(trainingCode[trainingCode.length - 1])
    }
    else {
      if (this.selectedTrainingCode[0] == 0) {
        this.selectedTrainingCode = []
        this.selectedTrainingCode.push(trainingCode[trainingCode.length - 1])
      }
    }

  }
  toggleMenuAction(menu: boolean) {
    this.isMenu = menu
  }
  capitalizeFirstLetter(input: string): string {
    if (input.length === 0) return input; // Handle empty string

    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  fromDateSelect(date: NgbDate) {

    this.searchModel.fromDate = this.formatDate(date)
    this.isFromDateValid = true
    this.minDate = date
    // this.minFromDate.year = date?.year==undefined?1900:date.year
    // this.minFromDate.month = date?.month==undefined?1:date.month
  }
  fromDateChange(event: Event) {

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (this.isValidDate(year + '-' + month + '-' + day)) {
        this.isFromDateValid = true
        this.searchModel.fromDate = value
      }
      else {
        this.isFromDateValid = false
      }
    }
    else {
      this.isFromDateValid = false
    }
  }


  toDateSelect(date: NgbDate | null) {

    this.searchModel.toDate = this.formatDate(date)
    this.isToDateValid = true
  }
  toDateChange(event: Event) {

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (this.isValidDate(year + '-' + month + '-' + day)) {
        this.isToDateValid = true
        this.searchModel.toDate = value
      }
      else {
        this.isToDateValid = false
      }
    }
    else {
      this.isToDateValid = false
    }
  }


  isValidDate(dateString: string): boolean {
    dateString = dateString.replace('-', '/').replace('-', '/')
    dateString.replace
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[0], 10);
      if (year.toString().length != 4)
        return false

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {

        const date = new Date(dateString);
        return !isNaN(date.getTime());
      }
      else {
        return false
      }
    }
    else {
      return false
    }

  }
  formatDate(date: NgbDate | null): string {

    if (date) {

      const day = date.day < 10 ? `0${date.day}` : date.day;
      const month = date.month < 10 ? `0${date.month}` : date.month;
      return `${day}/${month}/${date.year}`;
    }
    return '';
  }
  getDayClass(date: NgbDate): string {
    if (this.currentDate.day == date.day && this.currentDate.month == date.month && this.currentDate.year == date.year) {
      return 'custom-today'
    }
    else {
      return this.isSunday(date) ? 'custom-sunday' : '';
    }
  }

  isSunday(date: NgbDate): boolean {
    const day = new Date(date.year, date.month - 1, date.day).getDay();
    return day === 0; // 0 corresponds to Sunday
  }

  breakAndIsValidDate(dateString: string) {

    var newDate = dateString.split('/')[2] + '/' + dateString.split('/')[1] + '/' + dateString.split('/')[0]
    return this.isValidDate(newDate)
  }
  convertToYYYYMMDD(date: any) {
    var dateArr = date.split('-')
    var newDate = dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0]
    return newDate
  }

  compareDate(fromDate: any, toDate: any) {

  }

  showAlert(message: string) {

    this.alertMessage = message
    this.alertButton.nativeElement.click();
  }

  resetForm() {

    this.searchModel.fromDate = ''
    this.searchModel.toDate = ''
    this.selectedBranch = []
    this.selectedProfile = []
    this.selectedTrainingCode = []
    this.isSubmitted = false


  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    
    if (this.selectedFile) {
      this.reportService.upload(this.selectedFile).subscribe(response => {
        
      }, error => {
        console.error('Error uploading file:', error);
      });
    }
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  
}
