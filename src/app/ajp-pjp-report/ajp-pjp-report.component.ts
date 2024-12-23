import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../Services/common.service';
import { ReportsService } from '../Services/reports.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ajp-pjp-report',
  templateUrl: './ajp-pjp-report.component.html',
  styleUrls: ['./ajp-pjp-report.component.scss']
})
export class AjpPjpReportComponent implements OnInit {

  constructor(private commonService: CommonService,
    private reportService: ReportsService
  ) { }
  @ViewChild('alert', { static: false }) alertButton!: ElementRef;
  alertMessage!: string 
  branches = [{ BRANCHNAME: '', BRANCHCODE: '' }];
  isDashboard: boolean = false;
  regionList: any;
  BranchList: any;
  years: any = []
  arr: any = [] = []
  currentYear: any;
  year!: number
  month!: number
  regionId: any
  branchId: any
  isSubmitted: boolean = false
  dashboardData: any;
  index: number = 0
  modifiedData: any
  months = [
    { "Name": "Jan", "No": "01" },
    { "Name": "Feb", "No": "02" },
    { "Name": "Mar", "No": "03" },
    { "Name": "Apr", "No": "04" },
    { "Name": "May", "No": "05" },
    { "Name": "Jun", "No": "06" },
    { "Name": "Jul", "No": "07" },
    { "Name": "Aug", "No": "08" },
    { "Name": "Sep", "No": "09" },
    { "Name": "Oct", "No": "10" },
    { "Name": "Nov", "No": "11" },
    { "Name": "Dec", "No": "12" }
  ]
  public isMenu: boolean = false
  DesignationID: any
  roleName: string = ''
  loggedInUserID: any
  trainerId:any
  isLoader : boolean = false
  ngOnInit(): void {
    this.DesignationID = sessionStorage.getItem("DesignationID");
    this.trainerId  = sessionStorage.getItem("UserEmpID")
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
    this.getBranches()
  }
  getRegionList() {
    this.commonService.getRegions().subscribe(data => {

      this.regionList = data
    })
  }



  showDashboard(data: any) {

    this.isDashboard = true
    this.dashboardData = data;
  }
  toggleMenuAction(menu: boolean) {
    this.isMenu = menu
  }
  getAjpReport() {
    
    var allRegionId = this.regionList.map((x:any)=>x.REGIONNAME)
    var allBranchId = this.BranchList.map((x:any)=>x.BRANCHID)
    var finalRegion="0";
    var finalBranch = "0";
    
    this.isSubmitted = true;
    if (this.roleName == 'ADMIN')
      if (this.month == undefined || this.year == undefined || this.regionId == undefined || this.regionId?.length == 0) {
        return
      }
      else{
        if(this.regionId[0]=="0")
        {
          finalRegion  = "'"+allRegionId.join("','")+"'"
        }
        else{
          finalRegion = "'"+this.regionId?.join("','")+"'"
        }

      }
    if (this.roleName == 'TRAINEE')
      if (this.month == undefined || this.year == undefined || this.branchId == undefined || this.branchId?.length == 0) {
        return
      }
      else{
        if(this.branchId[0]=="0")
        {
          finalBranch = allBranchId?.join(',')
        }
        else{
          finalBranch = this.branchId?.join(',')
        }
      }
    var date = this.year + "-" + this.month + "-01"
    
    var branch = this.branchId?.join(',')
    this.isLoader = true;
    
    this.arr = []
    this.regionId?.forEach((element: any) => {
      var id = this.regionList.find((x: any) => x.REGIONNAME == element)?.REGIONID
      this.arr.push(id == undefined ? 0 : id)
    });
    var region = this.arr?.join(',')
      
      this.reportService.GetAJPReport(date, 
        region==""?"0":region,
        finalBranch,
        this.roleName,
        this.trainerId
      ).subscribe((data: any) => {
        this.isLoader = false;
        if (data.length > 0)
          this.exportAjpReport(data)
        else this.showAlert("No Record Found")
      },
      err=>{
        this.showAlert("Oops something went wrong.")
      })
 
  }

  getAJpPjpReport() {

    this.isSubmitted = true;
    if (this.roleName == 'ADMIN')
    if (this.month == undefined || this.year == undefined || this.regionId == undefined || this.regionId?.length == 0) {
      return
    }
    if (this.roleName == 'TRAINEE')
      if (this.month == undefined || this.year == undefined || this.branchId == undefined || this.branchId?.length == 0) {
        return
      }
      var allRegionId = this.regionList.map((x:any)=>x.REGIONNAME)
      var allBranchId = this.BranchList.map((x:any)=>x.BRANCHID)
      var finalRegion="0"
      var finalBranch="0";
      if (this.roleName == 'ADMIN')
        if (this.month == undefined || this.year == undefined || this.regionId == undefined || this.regionId?.length == 0) {
          return
        }
        else{
          if(this.regionId[0]=="0")
          {
            finalRegion  = "'"+allRegionId.join("','")+"'"
          }
          else{
            finalRegion = "'"+this.regionId?.join("','")+"'"
          }
  
        }
      if (this.roleName == 'TRAINEE')
        if (this.month == undefined || this.year == undefined || this.branchId == undefined || this.branchId?.length == 0) {
          return
        }
        else{
          if(this.branchId[0]=="0")
          {
            finalBranch = allBranchId?.join(',')
          }
          else{
            finalBranch = this.branchId?.join(',')
          }
        }
    var date = this.year + "-" + this.month + "-01"
    
    var branch = this.branchId?.join(',')
    this.isLoader = true

    this.arr = []
    this.regionId?.forEach((element: any) => {
      var id = this.regionList.find((x: any) => x.REGIONNAME == element)?.REGIONID
      this.arr.push(id == undefined ? 0 : id)
    });
    var region = this.arr?.join(',')
    
   
      this.reportService.GetAJPPJPReport(
        date,
        
        region==""?"0":region,
        finalBranch == ""?"0":finalBranch,
         this.roleName,
         this.trainerId).subscribe((data: any) => {
        this.isLoader=false
       
        if (data.length > 0)
        {
          this.exportAjpPjpReport(data)
          this.showAlert("Report has been downloaded.")
        }
          
        else
          this.showAlert("No Record Found.")
      })
   
  }
  exportAjpReport(data: any) {


    let excelData: any[] = [];

    data.forEach((x: any) => {
      
      x.TrainingMedium = x.TrainingMedium[0].toUpperCase().trim()=="V"?"Virtual":x.TrainingMedium.trim()
      x.TrainingMedium = x.TrainingMedium[0].toUpperCase().trim()=="C"?"Classroom":x.TrainingMedium.trim()
      x.TrainingMedium = x.TrainingMedium[0].toUpperCase().trim()=="I"?"On-store":x.TrainingMedium.trim()
      x.TrainingMedium = x.TrainingMedium[0].toUpperCase().trim()=="O"?"On-store":x.TrainingMedium.trim()
      if(x.TrainingAudience.toUpperCase()=="SSE" )
      {
        x.TrainingAudience="SSE"
      }
      else if(x.TrainingAudience.toUpperCase()=="CHANNEL PARTNER")
      {
        x.TrainingAudience = "Channel Partner"
      }
      else{
        x.TrainingAudience = "Branch Sales Staff"
      }
      var dataToExport: {}
      dataToExport = {
        "Zone": x.ZoneName,
        "Region": x.RegionName=="RO+UP"?"ROUP":x.RegionName,
        "Branch": x.BranchCode,
        "Trainer Id": isNaN(x.TrainerId)?x.TrainerId:Number(x.TrainerId),
        "Trainer Name": x.TrainerName,
        "Date": new Date(this.castReportDate( x.Date)),
        "Training Medium": x.TrainingMedium,
        "Training Code": x.TrainingCode,
        "Training Audience": x.TrainingAudience,
        "Audience Count": x.AudienceCount,
      }
      
      excelData.push(dataToExport);
    })
    var sortedData= [...excelData].sort((a, b) => a.Date - b.Date);
    excelData=sortedData;

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'AJP Report.xlsx');
  }

  castReportDate(date:any)
  {
var dateArr = date.split(" ")[0].split("/")
var day = dateArr[1];
var month = dateArr[0];
var year = dateArr[2];


return month+"-"+day+"-"+year;
  }

  exportAjpPjpReport(data: any) {


var b_Data = data;
var m_Data: {
  ZoneName: any; RegionName: any; BranchName: any; TrainerID: any; TrainerName: any; Date: any; 
  PJPTrainingMedium: any; PJPTrainingCode: any; PJPTrainingAudience: any; PJPAudienceCount: any; Helper1: any; Helper2: any; Match: any; TrainingMedium: any; TrainingCode: any; TrainingAudience: any; AJPAudienceCount: any;
}[] = []
const uniqueTrainers = [...new Set(data.map((item:any) => item.PjpId))];
uniqueTrainers.forEach((item:any)=>{
  var pjpRecord  = data.filter((x:any)=>x.PjpId == item)
  var a_count = data.filter((x:any)=>x.PjpId == item && x.ParticipantName != "" ).length
  if(pjpRecord[0]!=undefined){

  
  var obj ={
    "ZoneName": pjpRecord[0]?.ZoneName,
    "RegionName": pjpRecord[0]?.RegionName,
    "BranchName":  pjpRecord[0]?.BranchName,
    "TrainerID": pjpRecord[0].PjpTrainerId,
    "TrainerName": pjpRecord[0].TrainerName,
    "Date":pjpRecord[0].Date,
    "PJPTrainingMedium": pjpRecord[0].PJPTrainingMedium,
    "PJPTrainingCode": pjpRecord[0].PJPTrainingCode,
    "PJPTrainingAudience": pjpRecord[0].PJPTrainingAudience,
    "PJPAudienceCount": pjpRecord[0].PJPAudienceCount,
    "Helper1": pjpRecord[0].Date.split(" ")[0]+" & "+pjpRecord[0].PJPTrainingMedium,
    "Helper2": pjpRecord[0].AjpDate.split(" ")[0]+" & "+pjpRecord[0].TrainingMedium,
    "Match": pjpRecord[0].Match,
    "TrainingMedium": pjpRecord[0].TrainingMedium,
    "TrainingCode": pjpRecord[0].TrainingCode,
    "TrainingAudience": pjpRecord[0].TrainingAudience,
    "AJPAudienceCount":a_count
  }
  m_Data.push(obj)
}
})
data = m_Data
    let excelData: any[] = [];
 

    data.forEach((x: any) => {
      let count = data.filter((a:any)=>a.PjpTrainerId == x.TrainerID).length
      var dataToExport: {}
      dataToExport = {
        "Zone": x.ZoneName,
        "Region": x.RegionName=="RO+UP"?"ROUP":x.RegionName,
        "Branch": this.branches.find((y: any) => y.BRANCHNAME == x.BranchName)?.BRANCHCODE,
        "Trainer ID":isNaN( x.TrainerID)?x.TrainerID:Number(x.TrainerID),
        "Trainer Name": x.TrainerName,
        "Date": new Date(this.castReportDate( x.Date)),
        "PJP Training Medium": x.PJPTrainingMedium,
        "PJP Training Code": x.PJPTrainingCode,
        "PJP Training Audience": x.PJPTrainingAudience,
        "PJP Audience Count": x.PJPAudienceCount,
        "Helper1": x.Helper1,
        "Helper2": x.Helper2==" & "?"":x.Helper2,
        "Match Check": this.getMatch(x),
        "AJP Training Medium": x.TrainingMedium,
        "AJP Training Code": x.TrainingCode,
        "AJP Training Audience": x.TrainingAudience,
        "AJP Audience Count":x.AJPAudienceCount
      }
      
      excelData.push(dataToExport);
    })

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'PJP AJP Report.xlsx');
  }

  getMatch(data:any)
  {
    if(data.Helper1.toUpperCase() == data.Helper2.toUpperCase())
    {
      return "True";
    }
    else if(data.PJPTrainingMedium.toUpperCase()!= data.TrainingMedium.toUpperCase() &&data.date==data.AjpDate)
    {
      return "False";
    }
    else if(data.AttendanceState!=""){
      return data.AttendanceState
    }
    else{
      false
    }
  }

  viewAjpPjpDashboard() {


    this.isSubmitted = true;
    if (this.roleName == 'ADMIN')
    if (this.month == undefined || this.year == undefined || this.regionId == undefined || this.regionId?.length == 0) {
      return
    }
   if (this.roleName == 'TRAINEE')
      if (this.month == undefined || this.year == undefined || this.branchId == undefined || this.branchId?.length == 0) {
        return
      }

    var date = this.year + "-" + this.month + "-01"
    this.arr = []
    this.regionId?.forEach((element: any) => {
      var id = this.regionList.find((x: any) => x.REGIONNAME == element)?.REGIONID
      this.arr.push(id == undefined ? 0 : id)
    });
    var region = this.arr?.join(',')
    var branch = this.branchId?.join(',')
    var allBranchId = this.BranchList.map((x:any)=>x.BRANCHID)
    var finalBranch="0"
    if(this.roleName=="TRAINEE")
    {
      if(this.branchId[0]=="0")
        {
          finalBranch = allBranchId?.join(',')
        }
        else{
          finalBranch = this.branchId?.join(',')
        }
    }
 
    this.isLoader = true;
      this.reportService.GetAjpPjpDashboard(
     date,
     region==""?"0":region,
     finalBranch,
     this.roleName,
     this.trainerId).subscribe((data:any) => {
        this.isLoader = false;
        
      var finalObjArr: { TrainerEmpId: any; TrainerName: any; BranchCode: any; BranchName: any; RegionName: any; ZoneName: any; MatchCheckTotal: number; MatchCheckTrue: number; MatchCheckFalse: number; MatchCheckLeave: number; Adherence: number; }[] =[]
        const uniqueTrainers = [...new Set(data.DashboardCount.map((item:any) => item.TrainerEmpId))];
        uniqueTrainers.forEach((item:any)=>{
          var trainerData = data.DashboardCount.filter((x:any)=>x.TrainerEmpId == item)
          var arr: { TrainerEmpId: any;  Match: any; }[]=[]

          trainerData.forEach((t:any)=>{
            var obj={
              TrainerEmpId:t.TrainerEmpId,
              Match:this.getMatchForDashboard(t)

            }
            arr.push(obj)
          })
          var matchCheckTotal = arr.length
          var matchCheckTrue = arr.filter((a:any)=>a.Match=="True").length
          var matchCheckFalse = arr.filter((a:any)=>a.Match=="False").length
          var matchCheckLeave = arr.filter((a:any)=>a.Match=="LEAVE").length
          var Adherence =  matchCheckTrue/(matchCheckTotal-matchCheckLeave)
          var nAdheence =Number( Adherence.toFixed(2))
          var finalObj = {
            TrainerEmpId :isNaN( trainerData[0].TrainerEmpId)?trainerData[0].TrainerEmpId:Number(trainerData[0].TrainerEmpId),
            TrainerName : trainerData[0].TrainerName,
            BranchCode : trainerData[0].Branch,
            BranchName : trainerData[0].BranchName,
            RegionName : trainerData[0].Region,
            ZoneName : trainerData[0].Zone,
            MatchCheckTotal : matchCheckTotal,
            MatchCheckTrue : matchCheckTrue,
            MatchCheckFalse : matchCheckFalse,
            MatchCheckLeave : matchCheckLeave,
            Adherence :nAdheence
          }
          finalObjArr.push(finalObj)
        })
        var sortedData= [...finalObjArr].sort((a, b) => a.BranchCode - b.BranchCode);
        finalObjArr = sortedData

        var fRecords: { TrainerEmpId: any; TrainerName: any; BranchCode: any; BranchName: any; RegionName: any; ZoneName: any; MatchCheckTotal: number; MatchCheckTrue: number; MatchCheckFalse: number; MatchCheckLeave: number; Adherence: number; }[][]=[]
        var uniqueBranches = [...new Set(finalObjArr.map((item:any) => item.BranchCode))];
         var soterdBranch=[...uniqueBranches].sort((a, b) => a - b)
         var soterdBranch1=uniqueBranches.sort((a, b) => a.localeCompare(b) )
         soterdBranch.forEach((x:any)=>{
          var Record = finalObjArr.filter((y:any)=>y.BranchCode==x)
          var mRecord =  [...Record].sort((a, b) => a.TrainerName - b.TrainerName)
          mRecord.forEach((p:any)=>{ fRecords.push(p)})
         
        })
        if(finalObjArr?.length==0)
          this.showAlert("No Record Found")
        this.dashboardData = finalObjArr;
       
        var sortedData= [...finalObjArr].sort((a, b) => a.BranchCode - b.BranchCode);
   
        this.dashboardData = fRecords;


        this.sortData()
        this.showDashboard(fRecords)
      }),((err:any)=>{
        
      })
     
  }
  getMatchForDashboard(data:any)
  {
    var Helper1 = data.PjpDate+data.PjpTrainingMedium.toUpperCase();
    var Helper2 = data.Trainingdate+data.AjpTrainingMedium.toUpperCase();
    if(Helper1== Helper2)
    {
      return "True";
    }
    else if(data.PjpTrainingMedium.toUpperCase()!= data.AjpTrainingMedium.toUpperCase() &&data.PjpDate==data.Trainingdate)
    {
      if(data.AttendanceState.toUpperCase()=="LEAVE"){
        return data.AttendanceState.toUpperCase()
      }
      else{
        return "False";
      }
      
    }
    else{
      return "False";
    }
    

  }
  exportDownloadPjpAjpReportToCSV(data: any) {

    let excelData: any[] = [];

    data.forEach((x: any) => {
      
      var dataToExport: {}
      dataToExport = {
        "Adherence":parseFloat(x.Adherence).toFixed(2),
        "Branch Code": x.BranchCode,
        "Branch Name": x.BranchName,
        "Match Check False": x.MatchCheckFalse,
        "Match Check Leave": x.MatchCheckLeave,
        "Match Check Total": x.MatchCheckTotal,
        "Match Check True": x.MatchCheckTrue,
        "Region Name": x.RegionName,
        "Trainer EmpId": x.TrainerEmpId,
        "Trainer Name": x.TrainerName,
        "Zone Name": x.ZoneName
      }
      
      excelData.push(dataToExport);
    })

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'PJP AJP Report.xlsx');
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


    if (this.branchId[this.branchId.length - 1] == 0) {
      this.branchId = []
      this.branchId.push(branch[branch.length - 1])
    }
    else {
      if (this.branchId[0] == 0) {
        this.branchId = []
        this.branchId.push(branch[branch.length - 1])
      }
    }
  }

  getBranches() {

    this.commonService.getBranches(this.roleName, this.loggedInUserID).subscribe(data => {

      this.branches = data;
      this.BranchList = data;
    }, error => {


    });

  }

  sortData() {


    var Zones = this.dashboardData.map((item: { ZoneName: any; }) => item.ZoneName)
      .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)

    var Regions = this.dashboardData.map((item: { RegionName: any; }) => item.RegionName)
      .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)

    var Branches = this.dashboardData.map((item: { BranchName: any; }) => item.BranchName)
      .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)

    Zones = Zones.sort((a: string, b: any) => a.localeCompare(b))
    Regions = Regions.sort((a: string, b: any) => a.localeCompare(b))
    Branches = Branches.sort((a: string, b: any) => a.localeCompare(b))
    var regionArr: { RegionName: any; Data: any; }[] = []
    Regions.forEach((element: any) => {
      var data = this.dashboardData.filter((x: any) => x.RegionName == element)
      var obj = {
        "RegionName": element,
        "Data": data
      }
      regionArr.push(obj)
    });

    var zonesArr: { ZoneName: any; Data: any[]; }[] = []
    Zones.forEach((element: any) => {
      var tempArr: any[] = []
      regionArr.forEach((element2: any) => {
        var obj = element2.Data.filter((data: any) => data.ZoneName == element)
        if (obj.length > 0)
          tempArr.push({
            "RegionName": element2.RegionName,
            "Data": obj
          })
      });
      zonesArr.push({ "ZoneName": element, "Data": tempArr })
    });

    this.modifiedData = zonesArr;
   


  }
  showAlert(message: string) {
    
    this.alertMessage = message
    this.alertButton.nativeElement.click();
  }
}
