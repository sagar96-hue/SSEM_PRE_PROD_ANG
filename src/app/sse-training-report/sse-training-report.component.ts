import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../Services/common.service';
import { Router } from '@angular/router';
import { ReportsService } from '../Services/reports.service';
import * as XLSX from 'xlsx';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { start } from '@popperjs/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-sse-training-report',
  templateUrl: './sse-training-report.component.html',
  styleUrls: ['./sse-training-report.component.scss']
})

export class SseTrainingReportComponent implements OnInit {



  constructor(private commonService: CommonService,
    private reportService: ReportsService,
    private router: Router,
  ) {

  }
  branches = [{ BRANCHNAME: '', BRANCHCODE: '' ,BRANCHID:''}];
  branchesBackUp = [{ BRANCHNAME: '', BRANCHCODE: '' ,BRANCHID:''}];
  Trainers = [{
    "DESIGNATIONID": 0,
    "EMAILID": '',
    "ISACTIVE": '',
    "USEREMPID": '',
    "USERID": 0,
    "USERNAME": ''
  }]
  TrainersBackUP = [{
    "DESIGNATIONID": 0,
    "EMAILID": '',
    "ISACTIVE": '',
    "USEREMPID": '',
    "USERID": 0,
    "USERNAME": ''
  }]
  selectedCar: number = 1;
  selectedBranch: any;
  selectedCurrentStatus!: number;
  selectedTrainingCode: any;
  selectedCountType: any;
  selectedTrainedAudience: any;
  selectedTrainer: any
  selectedPGC: any
  selectedTerritory: string = '';
  dataBySSEId: any[] = []
  sseIdChanged: boolean = false
  isStartDateValid: boolean = true
  isEndDateValid: boolean = true
  isStartDojValid: boolean = true
  isEndDojValid: boolean = true
  CurrentStatus = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Inactive' },
  ]
  TrainedBy: any

  CountTypes = [
    { id: 0, name: 'Temporary' },
    { id: 1, name: 'Permanent' },

  ]

  trainingCodes: any = [
  ]
  selectedSSEId: any


  searchModel: any =
    {
      startDate: '',
      endDate: '',
      startDoj: '',
      endDoj: '',
      trainedAudience: '',
      branch: '',
      trainingCode: '',
      trainedBy: '',
      currentStatus: '',
      countType: '',
      pgc: ''

    }
  dateOfJoiningType!: number;
  fromDate: any;
  toDate: any;
  isSubmitted: boolean = false
  public isMenu: boolean = false
  PCGList: any
  trainedList: any[] = [];
  bramnchesArr: any[] = []
  isDownloadReport: boolean = false
  isDownloadPendingList: boolean = false
  isViewDashboard: boolean = false
  @ViewChild('alert', { static: false }) alertButton!: ElementRef;
  alertMessage!: string
  userId: any
  DesignationID: any
  roleName: string = ''
  loggedInUserID: any
  minDate = { year: 1990, month: 1, day: 1 };
  minDOJ = { year: 1990, month: 1, day: 1 };
  isLoader:boolean=false
  currentDate ={year: new Date().getFullYear(),month: new Date().getMonth()+1,day: new Date().getDate() }
  ngOnInit(): void {

    this.DesignationID = sessionStorage.getItem("DesignationID");
    if (this.DesignationID == '202'||this.DesignationID == '262') {
      this.roleName = 'ADMIN'
    }
    else if (this.DesignationID == '122') {
      this.roleName = 'TRAINEE'
    }
    this.userId = sessionStorage.getItem("UserEmpID")
    this.loggedInUserID = sessionStorage.getItem("UserId")
    this.getBranches();
    this.getTrainingCode();
    this.getTrainers();
    this.getPCGList();
  }

  getBranches() {

    this.commonService.getBranches(this.roleName, this.loggedInUserID).subscribe(data => {

      this.branches = data;
      this.branchesBackUp = data;
    }, error => {


    });

  }

  getTrainingCode() {
    this.commonService.getTrainingCodes().subscribe(data => {
      this.trainingCodes = data
    })
  }

  getTrainers() {
    this.commonService.getTrainersForSSE().subscribe(data => {

      this.Trainers = data;
      this.TrainersBackUP = data;
    })
  }

  redirectToDashboard() {
    this.isSubmitted = true
    if (this.isValidate())
      return
    if (this.selectedTrainedAudience == 0)
      this.searchModel.trainedAudience = 0
    else
      this.searchModel.trainedAudience = this.selectedSSEId
    
    this.searchModel.countType = this.selectedCountType
    this.searchModel.currentStatus = this.selectedCurrentStatus;
    this.searchModel.branch = this.selectedBranch == undefined ? '' : this.selectedBranch?.join("|");

    this.searchModel.trainingCode = this.selectedTrainingCode == undefined ? '' : this.selectedTrainingCode?.join("|")
    this.searchModel.trainedBy = this.selectedTrainer == undefined ? '' : this.selectedTrainer?.join("|");
    this.searchModel.pgc = this.selectedPGC == undefined ? '' : this.selectedPGC?.join("|");
    // if (this.isViewDashboard) {
    //   this.redirectToDashboard()
    // }
    var trainingCode = this.selectedTrainingCode.join(',')
    //var branchName = this.branches.filter(x => x.BRANCHCODE == this.selectedBranch.toString())
    this.router.navigate(
      ['/sse-dashboard'],
      {
        queryParams: {
          SelectedTerritory: this.selectedTerritory,
          FromDate: this.searchModel.startDate,
          ToDate: this.searchModel.endDate,
          TrainingCode: this.searchModel.trainingCode,
          TrainedAudience: this.searchModel.trainedAudience,
          Branch: this.searchModel.branch,
          CurrentStatus: this.searchModel.currentStatus,
          CountType: this.searchModel.countType,
          TrainedBy: this.searchModel.trainedBy,
          StartDOJ: this.searchModel.startDoj,
          EndDOJ: this.searchModel.endDoj,
          PCGList: this.searchModel.pgc,
          DateOfJoiningType: this.dateOfJoiningType
        }
      }
    );
  }


  search() {

    this.isSubmitted = true
    if (this.isValidate())
      return
    if (this.selectedTrainedAudience == 0)
      this.searchModel.trainedAudience = 0
    else
      this.searchModel.trainedAudience = this.selectedSSEId
    this.searchModel.countType = this.selectedCountType
    this.searchModel.currentStatus = this.selectedCurrentStatus;
    this.searchModel.branch = this.selectedBranch == undefined ? '' : this.selectedBranch?.join("|");

    this.searchModel.trainingCode = this.selectedTrainingCode == undefined ? '' : this.selectedTrainingCode?.join("|")
    this.searchModel.trainedBy = this.selectedTrainer == undefined ? '' : this.selectedTrainer?.join("|");
    this.searchModel.pgc = this.selectedPGC == undefined ? '' : this.selectedPGC?.join("|");
    if (this.isViewDashboard) {
      this.redirectToDashboard()
    }
    this.isLoader = true
    
    this.reportService.GetSSEDashboard(this.convertDate(this.searchModel.startDate), this.convertDate(this.searchModel.endDate),
      this.searchModel.startDoj == "" ? "" : this.convertDate(this.searchModel.startDoj),
      this.searchModel.endDoj == "" ? "" : this.convertDate(this.searchModel.endDoj),
      this.searchModel.trainedAudience, this.searchModel.branch,
      this.searchModel.trainingCode, this.searchModel.trainedBy,
      this.searchModel.countType, this.searchModel.pgc,
      this.searchModel.currentStatus, this.dateOfJoiningType, this.roleName, this.userId
    ).subscribe(data => {

this.isLoader = false
      if (this.isDownloadReport) {
        this.trainedList = [];
        this.bramnchesArr = this.searchModel.branch.split('|')
        var pCount = 0
        if (this.bramnchesArr[0] == 0) {
          this.branches.forEach((element: any) => {

            var trained = data?.SSETrainingReports.filter((x: any) => x.BranchName == element.BRANCHNAME)
            var total = data?.CurrentEmployees.filter((x: any) => x.BranchName == element.BRANCHNAME)
            pCount = data?.PendingList.filter((x: any) => x.BranchName == element.BRANCHNAME).length
            

            var trainedCount = trained?.length
            var totalCount = total.length
            //var pendingCount = totalCount - trainedCount
            if (trainedCount != 0) {
              var obj = {
                "Zone": trained[0].ZoneName,
                "Region": trained[0].RegionName,
                "Branch": element.BRANCHCODE,
                "TrainingCompleted": trainedCount,
                "TrainingPending": pCount,
                "TotalToBeTrained": totalCount
              }
              this.trainedList.push(obj)
            }
          });
        }
        else {
          this.bramnchesArr.forEach((element: any) => {


            var trained = data?.SSETrainingReports.filter((x: any) => x.BranchName == element)
            var total = data?.CurrentEmployees.filter((x: any) => x.BranchName == element)
            pCount = data?.PendingList.filter((x: any) => x.BranchName == element).length

            var branchCode = this.branches.find((x:any)=>x.BRANCHNAME ==element)
            var trainedCount = trained?.length
            var totalCount = total.length
            //var pendingCount = totalCount - trainedCount
            if (trainedCount != 0) {
              var obj = {
                "Zone": trained[0].ZoneName,
                "Region": trained[0].RegionName,
                "Branch": branchCode?.BRANCHCODE,
                "TrainingCompleted": trainedCount,
                "TrainingPending": pCount,
                "TotalToBeTrained": totalCount
              }
              this.trainedList.push(obj)
            }

          });
        }
        if (this.trainedList?.length > 0){
          this.exportDownloadReport(this.trainedList)
          this.showAlert("Report has been downloaded")
         // this.resetForm()
        }
         
        else {
          this.showAlert("No Records Found")
        }

      }
      else if (this.isDownloadPendingList) {
        this.exportPendingList(data?.PendingList)
      }
      // else if(this.isViewDashboard)
      // {
      //   this.commonService.SSE_Data.next(data?.PendingList);
      //   this.redirectToDashboard()
      // }

    },error=>{
      this.isLoader = false
    })

  }

  // dateOfJoiningChange() {

  //   if (this.dateOfJoiningType == 0) {

  //   }
  //   else {

  //   }
  // }

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

  trainedByChange(trainedBy: any) {

    if (this.selectedTrainer[this.selectedTrainer.length - 1] == 0) {
      this.selectedTrainer = []
      this.selectedTrainer.push(trainedBy[trainedBy.length - 1])
    }
    else {
      if (this.selectedTrainer[0] == 0) {
        this.selectedTrainer = []
        this.selectedTrainer.push(trainedBy[trainedBy.length - 1])
      }
    }

  }
  toggleMenuAction(menu: boolean) {
    this.isMenu = menu
  }
  isValidate() {

    if (this.searchModel.startDate != null && this.searchModel.startDate != '')
      this.isStartDateValid = this.isValidDate(this.searchModel.startDate)
    if (this.searchModel.endDate != null && this.searchModel.endDate != '')
      this.isEndDateValid = this.isValidDate(this.searchModel.endDate)
    if (this.dateOfJoiningType != 0 && this.dateOfJoiningType != undefined) {
      if (this.searchModel.startDoj != null && this.searchModel.startDoj != '')
        this.isStartDojValid = this.isValidDate(this.searchModel.startDoj)
      if (this.searchModel.endDoj != null && this.searchModel.endDoj != '')
        this.isEndDojValid = this.isValidDate(this.searchModel.endDoj)
    }
    if ((this.searchModel.startDate == null || this.searchModel.startDate == '')
      || (this.searchModel.endDate == null || this.searchModel.endDate == '')
      || (this.selectedTrainedAudience == 1 && this.selectedSSEId == '')
      || (this.selectedBranch == undefined || this.selectedBranch?.length == 0)
      || (this.selectedCurrentStatus == null)
      || (this.selectedTrainingCode == undefined || this.selectedTrainingCode?.length == 0)
      || (this.selectedCountType == null)
      || (this.selectedTrainer == undefined || this.selectedTrainer.length == 0)
      || (this.dateOfJoiningType == 1 && (this.searchModel.startDoj == "" || this.searchModel.endDoj == ""))
      || (this.selectedPGC == undefined || this.selectedPGC == null)
      || (this.selectedTerritory == "")
      || (!this.isValidDate(this.searchModel.startDate))
      || !this.isValidDate(this.searchModel.endDate)
      || this.dateOfJoiningType != 0 && !this.isValidDate(this.searchModel.startDoj)
      || this.dateOfJoiningType != 0 && !this.isValidDate(this.searchModel.endDoj)
    ) {
      return true;
    }
    else {
      return false
    }
  }
  getPCGList() {
    this.commonService.getPCG().subscribe(data => {

      this.PCGList = data;
    }, error => {

    })
  }

  downloadReport() {
    
    this.isSubmitted = true
    if (this.isValidate())
      return
    if (this.selectedTrainedAudience == 0)
      this.searchModel.trainedAudience = 0
    else
      this.searchModel.trainedAudience = this.selectedSSEId
    this.searchModel.countType = this.selectedCountType
    this.searchModel.currentStatus = this.selectedCurrentStatus;
    this.searchModel.branch = this.selectedBranch == undefined ? '' : this.selectedBranch?.join("|");

    this.searchModel.trainingCode = this.selectedTrainingCode == undefined ? '' : this.selectedTrainingCode?.join("|")
    this.searchModel.trainedBy = this.selectedTrainer == undefined ? '' : this.selectedTrainer?.join("|");
    this.searchModel.pgc = this.selectedPGC == undefined ? '' : this.selectedPGC?.join("|");
    this.isLoader = true
    var newBranchId: (string | undefined)[] = []
    if(this.selectedBranch.length>0)
    {
      this.selectedBranch.forEach((element:any) => {
        var bId = this.branches.find((x:any)=>x.BRANCHNAME ==element)?.BRANCHID
        newBranchId.push(bId)
      });
    }
    var allBranch = this.branches.map((item:any) => item.BRANCHID)
    var allBranchID=allBranch.join(",")

    var alltrainingCode = this.trainingCodes.map((item:any) => item.TRAINING_CODE)
    var alltrainingCodeId = alltrainingCode.join("','")

    this.reportService.GetSSEDashboard(
      this.convertDate(this.searchModel.startDate), 
    this.convertDate(this.searchModel.endDate),
      this.searchModel.startDoj == "" ? "" : this.convertDate(this.searchModel.startDoj),
      this.searchModel.endDoj == "" ? "" : this.convertDate(this.searchModel.endDoj),
      this.searchModel.trainedAudience, 
      this.searchModel.branch =="0"?allBranchID:newBranchId.join(","),
      this.searchModel.trainingCode == "0"?("'"+alltrainingCodeId+"'"):"'"+this.selectedTrainingCode?.join("','")+"'",
       this.searchModel.trainedBy =="0"?"0":"'"+this.selectedTrainer?.join("','")+"'",
      this.searchModel.countType=="0"?"0":this.searchModel.countType,
       this.searchModel.pgc=="0"?"0":"'"+ this.selectedPGC?.join("','")+"'",
      this.searchModel.currentStatus,
       this.dateOfJoiningType,
        this.roleName,
         this.userId
    ).subscribe(data => {

this.isLoader = false
var newData  = data.SSETrainingReports.filter((x:any)=>x.TrainerName !=null && x.TrainerName!="" && x.Designation.toUpperCase() =="SSE")
if(newData?.length>0)  
this.ExportTOExcelAsTDR(newData);
else
this.showAlert("No Data Found");

        // this.trainedList = [];
        // this.bramnchesArr = this.searchModel.branch.split('|')
        // var pCount = 0
        // if (this.bramnchesArr[0] == 0) {
        //   this.branches.forEach((element: any) => {

        //     var trained = data?.SSETrainingReports.filter((x: any) => x.BranchName == element.BRANCHNAME)
        //     var total = data?.CurrentEmployees.filter((x: any) => x.BranchName == element.BRANCHNAME)
        //     pCount = data?.PendingList.filter((x: any) => x.BranchName == element.BRANCHNAME).length
            

        //     var trainedCount = trained?.length
        //     var totalCount = total.length
        //     //var pendingCount = totalCount - trainedCount
        //     if (trainedCount != 0) {
        //       var obj = {
        //         "Zone": trained[0].ZoneName,
        //         "Region": trained[0].RegionName,
        //         "Branch": element.BRANCHCODE,
        //         "TrainingCompleted": trainedCount,
        //         "TrainingPending": pCount,
        //         "TotalToBeTrained": totalCount
        //       }
        //       this.trainedList.push(obj)
        //     }
        //   });
        // }
        // else {
        //   this.bramnchesArr.forEach((element: any) => {


        //     var trained = data?.SSETrainingReports.filter((x: any) => x.BranchName == element)
        //     var total = data?.CurrentEmployees.filter((x: any) => x.BranchName == element)
        //     pCount = data?.PendingList.filter((x: any) => x.BranchName == element).length

        //     var branchCode = this.branches.find((x:any)=>x.BRANCHNAME ==element)
        //     var trainedCount = trained?.length
        //     var totalCount = total.length
        //     //var pendingCount = totalCount - trainedCount
        //     if (trainedCount != 0) {
        //       var obj = {
        //         "Zone": trained[0].ZoneName,
        //         "Region": trained[0].RegionName,
        //         "Branch": branchCode?.BRANCHCODE,
        //         "TrainingCompleted": trainedCount,
        //         "TrainingPending": pCount,
        //         "TotalToBeTrained": totalCount
        //       }
        //       this.trainedList.push(obj)
        //     }

        //   });
        // }
        // if (this.trainedList?.length > 0){
        //   this.exportDownloadReport(this.trainedList)
        //   this.showAlert("Report has been downloaded")
        //  // this.resetForm()
        // }
         
        // else {
        //   this.showAlert("No Records Found")
        // }

      
   


    },error=>{
      this.isLoader = false
    })
    // this.isDownloadReport = true
    // this.isDownloadPendingList = false
    // this.isViewDashboard = false
     //this.search()
  }
  // downloadPendingList() {
  //   this.isDownloadReport = false
  //   this.isDownloadPendingList = true
  //   this.isViewDashboard = false
  //   this.search()
  // }
  // viewDashboard() {
  //   this.isDownloadReport = false
  //   this.isDownloadPendingList = false
  //   this.isViewDashboard = true
  //   this.search()

  // }
  exportDownloadReport(data: any) {


    let excelData: any[] = [];

    data.forEach((x: any) => {
      var dataToExport: {}
      dataToExport = {
        "Zone": x.Zone,
        "Region": x.Region,
        "Branch": x.Branch,
        //"Training Completed": x.TrainingCompleted,
        "Training Completed": x.TotalToBeTrained - x.TrainingPending,
        "Training Pending": x.TrainingPending,
        "Total To Be Trained": x.TotalToBeTrained,
      }
      //i = i + 1;
      excelData.push(dataToExport);
    })

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'SSE Report.xlsx');

    this.showAlert("Report has been downloaded")
  }

  exportPendingList(data: any) {


    let excelData: any[] = [];

    data.forEach((x: any) => {
      var dataToExport: {}
      dataToExport = {
        "Branch Name": x.BranchName,
        "Region Name": x.RegionName,
        "SSE ID": x.SSEID,
        "SSE Name": x.SSEName,
        "SSE PCG": x.SSEPCG,
        "Zone Name": x.ZoneName,
      }
      //i = i + 1;
      excelData.push(dataToExport);
    })

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'SSE Pending List.xlsx');
    this.showAlert("Report has been downloaded")


  }

  ExportTOExcelAsTDR(data: any) {

    var sortedData= [...data].sort((a, b) => a.ParticipantEmployeeId - b.ParticipantEmployeeId);
    data=sortedData;
   let excelData: any[] = [];

   data.forEach((x: any) => {
     var dataToExport: {}
     x.TrainingMedium = x.TrainingMedium[0]?.toUpperCase().trim()=="V"?"Virtual":x.TrainingMedium.trim()
     x.TrainingMedium = x.TrainingMedium[0]?.toUpperCase().trim()=="C"?"Classroom":x.TrainingMedium.trim()
     x.TrainingMedium = x.TrainingMedium[0]?.toUpperCase().trim()=="I"?"On-store":x.TrainingMedium.trim()
     x.TrainingMedium = x.TrainingMedium[0]?.toUpperCase().trim()=="O"?"On-store":x.TrainingMedium.trim()
     dataToExport = {
       "Year": x.Year,
       "Month": x.Month,
       "Trainer EmpId":isNaN(x.TrainerEmpId)?x.TrainerEmpId:  Number( x.TrainerEmpId),
       "Trainer Name": x.TrainerName,
       "Region Name": x.RegionName=="RO+UP"?"ROUP":x.RegionName,
       "Branch Code": x.BranchCode,
       "Participant Employee Id":isNaN(x.ParticipantEmployeeId)?x.ParticipantEmployeeId: Number( x.ParticipantEmployeeId),
       "Participant Name": x.ParticipantName,
       "Designation": x.Designation,
       "GTM Code": x.GTMCode,
       "Date Of Training":new Date( x.DateOfTraining),
       "Topic Covered": x.TopicCovered,
       "Training Code": x.TrainingCode,
       "Pre Score":Number( x.PreScore),
       "Post Score":Number( x.PostScore),
       // "Training Medium":this.titleCaseWord( x.TrainingMedium.trim()),
       "Training Medium":x.TrainingMedium,
       "Current Status": this.capitalizeFirstLetter(x.CurrentStatus),
       "Master Profile":this.getMasterProfile(x.Designation),
       "BPT Id": x.BPT_ID=="0"?"":x.BPT_ID,
       "BPT Name": x.BPT_Name=="-Select-"?"":x.BPT_Name,
       "PCG":x.PCG
     }
     //i = i + 1;
     excelData.push(dataToExport);
   })
 
   const ws = XLSX.utils.json_to_sheet(excelData);

   const wb = XLSX.utils.book_new();

   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

   XLSX.writeFile(wb, 'SSE Report Report.xlsx');

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

  pgcChange(pgc: any) {

    if (this.selectedPGC[this.selectedPGC.length - 1] == 0) {
      this.selectedPGC = []
      this.selectedPGC.push(pgc[pgc.length - 1])
    }
    else {
      if (this.selectedPGC[0] == 0) {
        this.selectedPGC = []
        this.selectedPGC.push(pgc[pgc.length - 1])
      }
    }

  }

  trainedAudienceChange(tAudience: any) {
    if (tAudience == "0") {
      this.branches = this.branchesBackUp
      this.Trainers = this.TrainersBackUP
      this.selectedPGC = []
      this.selectedBranch = []
      this.selectedTrainer = []
      this.searchModel.startDoj = ""
      this.searchModel.endDoj = ""
    }
  }

  getDataBySSEId(id: any) {

    this.sseIdChanged = true
    this.commonService.getDataBySSEId(id).subscribe((data: any) => {

      this.dataBySSEId = data;
      if (this.dataBySSEId.length > 0) {

        // this.branches = []
        //this.Trainers = []
        // this.selectedTrainer =[]
        
        this.selectedBranch = []
        var branchArr = this.dataBySSEId[0].BranchName.split(',')
        //var branchArr = this.dataBySSEId.map((x:any)=>x.BranchName)
        branchArr.forEach((element: any) => {
          var data = this.branchesBackUp.filter((x: any) => x.BRANCHNAME == element)
          if (data.length > 0) {
            this.selectedBranch.push(element)
            //this.branches.push(data[0])
          }

        })
        //this.selectedBranch.push(this.dataBySSEId[0].BranchName)

        this.selectedCountType = this.dataBySSEId[0].CountType
        this.selectedPGC = []
        this.selectedPGC.push(this.dataBySSEId[0].ProductCategoryGroupName)
        this.selectedTrainer = []
        var trainerArr = this.dataBySSEId.map(item => item.TrainerNames)
      .filter((value, index, self) => self.indexOf(value) === index)
        //var trainerArr = this.dataBySSEId.filter(x=>x.USERNAME).
        //var trainerArr = this.dataBySSEId[0].TrainerNames.split(',')
        trainerArr.forEach((element: any) => {
          var t_data = this.TrainersBackUP.filter(x => x.USERNAME == element)
          if (t_data.length > 0) {
            this.selectedTrainer.push(t_data[0].USEREMPID)
            // this.selectedTrainer.push(element)
            this.Trainers.push(data[0])
          }
        });
        if(this.Trainers.length==0)
          this.Trainers=this.TrainersBackUP
        // this.selectedTrainer.push(this.dataBySSEId[0].TrainerNames)
        if (data[0].DateOfJoining != "") {
          var date = data[0].DateOfJoining.split('T')[0].split('-')

          this.searchModel.startDoj = date[2] + '/' + date[1] + '/' + date[0]
          this.searchModel.endDoj = date[2] + '/' + date[1] + '/' + date[0]
          this.dateOfJoiningType = 1
        }

      }
      else {
        this.branches = this.branchesBackUp
        this.Trainers = this.TrainersBackUP
        this.selectedBranch = []
        this.searchModel.branch=''
        this.searchModel.startDoj = ''
        this.searchModel.endDoj = ''
        this.selectedPGC = []
        this.selectedTrainer = []

      }
    })
  }
  //date formatting work
  formattedDate: string = '';




  getDayClass(date: NgbDate): string {
    
    if(this.currentDate.day==date.day && this.currentDate.month == date.month && this.currentDate.year==date.year)
    {
      return 'custom-today'
    }
    else{
      return this.isSunday(date) ? 'custom-sunday' : '';
    }
    
  }

  isSunday(date: NgbDate): boolean {
    const day = new Date(date.year, date.month - 1, date.day).getDay();
    return day === 0; // 0 corresponds to Sunday
  }

  // updateFormattedDate(): void {
  //   this.formattedDate = this.formatDate(this.model);
  // }
  formatDate(date: NgbDate | null): string {

    if (date) {

      const day = date.day < 10 ? `0${date.day}` : date.day;
      const month = date.month < 10 ? `0${date.month}` : date.month;
      return `${day}/${month}/${date.year}`;
    }
    return '';
  }
  startDateSelect(date: NgbDate) {

    this.searchModel.startDate = this.formatDate(date)
    this.isStartDateValid = true
    this.minDate = date
  }
  startDateChange(event: Event) {

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (this.isValidDate(day + '/' + month + '/' + year)) {
        this.isStartDateValid = true
        this.searchModel.startDate = value
      }
      else {
        this.isStartDateValid = false
      }

    }
    else {
      this.isStartDateValid = false
    }

  }
  endDateSelect(date: NgbDate | null) {

    this.searchModel.endDate = this.formatDate(date)
    this.isEndDateValid = true
  }
  endDateChange(event: Event) {

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (this.isValidDate(day + '/' + month + '/' + year)) {
        this.isEndDateValid = true
        this.searchModel.endDate = value
      }
      else {
        this.isEndDateValid = false
      }
    }
    else {
      this.isEndDateValid = false
    }
  }

  startDojSelect(date: NgbDate) {

    this.searchModel.startDoj = this.formatDate(date)
    this.isStartDojValid = true
    this.minDOJ = date
  }
  startDojChange(event: Event) {

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (this.isValidDate(day + '/' + month + '/' + year)) {
        this.isStartDojValid = true
        this.searchModel.startDoj = value
      }
      else {
        this.isStartDojValid = false
      }
    }
    else {
      this.isStartDojValid = false
    }
  }


  endDojSelect(date: NgbDate | null) {

    this.searchModel.endDoj = this.formatDate(date)
    this.isEndDojValid = true
  }
  endDojChange(event: Event) {

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      if (this.isValidDate(day + '/' + month + '/' + year)) {
        this.isEndDojValid = true
        this.searchModel.endDoj = value
      }
      else {
        this.isEndDojValid = false
      }
    }
    else {
      this.isEndDojValid = false
    }
  }

  onInputDateChange(event: Event) {

    const input = event.target as HTMLInputElement;
    const value = input.value;

    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        this.model = new NgbDate(year, month, day);
        return this.model
        //this.updateFormattedDate();
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }

  model: NgbDate | null = null;
  // breakAndIsValidDate(dateString:string)
  // {

  //   var newDate= dateString.split('/')[2]+'/'+dateString.split('/')[1]+'/'+dateString.split('/')[0]
  //   return this.isValidDate(newDate)
  // }
  isValidDate(dateString: string): boolean {

    dateString = dateString.replace('-', '/').replace('-', '/')

    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      var finalDate = year + '-' + month + '-' + day
      if (year.toString().length != 4 || day.toString().length > 2 || day.toString().length == 0 || month.toString().length == 0 || month.toString().length > 2)
        return false

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {

        const date = new Date(finalDate);
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

  convertDate(date: string) {
    var daterArr = date.split('/')
    return daterArr[2] + '-' + daterArr[1] + '-' + daterArr[0]
  }


  showAlert(message: string) {

    this.alertMessage = message
    this.alertButton.nativeElement.click();
  }

  resetForm()
  {
    this.searchModel.startDate = ''
    this.searchModel.endDate = ''
    this.selectedTrainedAudience = ''
    this.selectedSSEId = ''
    this.selectedBranch = []
    this.selectedTrainingCode =[]
    this.selectedTrainer = []
    this.dateOfJoiningType  = 0
    this.searchModel.startDoj = ''
    this.searchModel.endDoj = ''
    this.selectedPGC = []
    this.selectedCurrentStatus =3
    this.selectedCountType = 2
    this.selectedTerritory = ''
    this.isSubmitted = false
  }

  capitalizeFirstLetter(input: string): string {
    if (input.length === 0) return input; // Handle empty string

    return input.charAt(0).toUpperCase() + input.slice(1);
  }
}
