import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../Services/common.service';
import { ReportsService } from '../Services/reports.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pjp-report',
  templateUrl: './pjp-report.component.html',
  styleUrls: ['./pjp-report.component.scss']
})
export class PjpReportComponent implements OnInit {

  constructor(private commonService: CommonService,
    private reportService: ReportsService
  ) { }
  pjpReport: any;
  isDashboard: boolean = false;
  year!: number
  month!: number
  regionId: any
  branchnId: any
  isSubmitted: boolean = false
  isMenu: boolean = false
  DesignationID: any
  roleName: string = ''
  loggedInUserID:any
  trainerId:any
  @ViewChild('alert', { static: false }) alertButton!: ElementRef;
  alertMessage!: string
  isLoader:boolean=false
  ngOnInit(): void {
    this.trainerId = sessionStorage.getItem("UserEmpID");
    this.DesignationID = sessionStorage.getItem("DesignationID");
    if (this.DesignationID == '202'|| this.DesignationID == '262') {
      this.roleName = 'ADMIN'
    }
    else if (this.DesignationID == '122') {
      this.roleName = 'TRAINEE'
    }
    this.loggedInUserID = sessionStorage.getItem("UserId")
    this.currentYear = new Date().getFullYear()
    this.getRegionList();
    for (let index = 2024; index <= this.currentYear; index++) {
      this.years.push(index)
    }
    // this.getBranches();
    this.getBranchList();
  }
  showDashboard() {
    this.isDashboard = true
  }
  regionList: any;
  branchList: any;
  currentYear: any;

  years: any = []
  branches = [{ BRANCHNAME: '', BRANCHCODE: '' }];
  months = [
    { "Name": "Jan", "No": 1 },
    { "Name": "Feb", "No": 2 },
    { "Name": "Mar", "No": 3 },
    { "Name": "Apr", "No": 4 },
    { "Name": "May", "No": 5 },
    { "Name": "Jun", "No": 6 },
    { "Name": "Jul", "No": 7 },
    { "Name": "Aug", "No": 8 },
    { "Name": "Sep", "No": 9 },
    { "Name": "Oct", "No": 10 },
    { "Name": "Nov", "No": 11 },
    { "Name": "Dec", "No": 12 }
  ]
  getRegionList() {
    this.commonService.getRegions().subscribe(data => {
      // data.filter((x:any)=>x.REGIONNAME == "RO+UP"?"ROUP":x.REGIONNAME)
   data.forEach((item:any)=>{
item.REGIONNAME=="RO+UP"?"ROUP":item.REGIONNAME
      })

      this.regionList = data
    })
  }

  getBranchList() {
    this.commonService.getBranches(this.roleName,this.loggedInUserID).subscribe(data => {

      this.branchList = data
      this.branches = data;
    })
  }

  getPjpReport() {

    this.isSubmitted = true
    if (this.year == 0 || this.year == undefined || this.month == 0 || this.month == undefined
      || (this.roleName == "ADMIN" && (this.regionId == undefined || this.regionId?.length == 0))
      || (this.roleName == "TRAINEE" && (this.branchnId == undefined || this.regionId?.branchnId == 0))
    ) {

      return
    }
    
    var regions = this.regionId?.join(",")
    var branchs = this.branchnId?.join(",")
    this.isLoader = true
    if(this.roleName=='ADMIN')
    this.reportService.GetPJPReportForDownload(this.month, this.year, regions).subscribe(data => {
      this.isLoader = false
      this.pjpReport = data;
      if (this.pjpReport.length > 0)
        this.exportToExcel(this.pjpReport);
      else this.showAlert("No Record Found")
    }, error => {
      this.isLoader = false
    })

    else
    this.reportService.GetPJPReportForDownloadForTrainer(this.month, this.year, branchs,this.trainerId).subscribe(data => {
      this.isLoader = false
      this.pjpReport = data;
      if (this.pjpReport.length > 0)
        this.exportToExcel(this.pjpReport);
      else this.showAlert("No Record Found")
    }, error => {
      this.isLoader = false
    })
  }

  exportToExcel(data: any) {


// var sortedData= [...data].sort((a, b) => a.PJPDate - b.PJPDate);
// data = sortedData
    let excelData: any[] = [];

    data.forEach((x: any) => {
      var dataToExport: {}
   
      dataToExport = {
        "Zone": x.ZoneName,
        "Region": x.RegionName=="RO+UP"?"ROUP": x.RegionName,
        "Branch": this.branches.find((y: any) => y.BRANCHNAME == x.BranchName)?.BRANCHCODE,
        "Trainer ID": x.TrainerEmployeeId,
        "Trainer Name": x.TrainerName,
        "Date": new Date(x.PJPDate),
        "Training Medium": x.TrainingMediumName,
        "Training Code": x.TrainingCode,
        "Training Audience": x.TrainingAudienceName,
        "Expected Audience Count": x.ExpectedAudienceCount,
      }
      //i = i + 1;
      excelData.push(dataToExport);
    })
    var sortedData= [...excelData].sort((a, b) => a.Date - b.Date);
    excelData = sortedData
    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'PJP Report.xlsx');
  }
  toggleMenuAction(menu: boolean) {
    this.isMenu = menu
  }
  regionChange(region: any) {


    if (this.regionId[this.regionId.length - 1] == 0) {
      this.regionId = []
      this.regionId.push(region[region.length - 1])
    }
    else {
      if (this.regionId[0] == 0) {
        this.regionId = []
        this.regionId.push(region[region.length - 1])
      }
    }
  }

  branchChange(branch: any) {

    if (this.branchnId[this.branchnId.length - 1] == 0) {
      this.branchnId = []
      this.branchnId.push(branch[branch.length - 1])
    }
    else {
      if (this.branchnId[0] == 0) {
        this.branchnId = []
        this.branchnId.push(branch[branch.length - 1])
      }
    }
  }
  showAlert(message: string) {

    this.alertMessage = message
    this.alertButton.nativeElement.click();
  }
  // getBranches() {

  //   this.commonService.getBranches().subscribe(data => {

  //     this.branches = data;
  //   }, error => {


  //   });

  // }

}
