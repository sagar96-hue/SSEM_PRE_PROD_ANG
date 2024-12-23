import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../Services/modal.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../Services/common.service';
import { ReportsService } from '../Services/reports.service';
import * as XLSX from 'xlsx';
import { EditorConfig, ST_BUTTONS } from 'ngx-simple-text-editor';
@Component({
  selector: 'app-sse-dashboard',
  templateUrl: './sse-dashboard.component.html',
  styleUrls: ['./sse-dashboard.component.scss']
})
export class SseDashboardComponent implements OnInit {
  content = '';
  config: EditorConfig = {
    placeholder: 'Type something...',
    buttons: ST_BUTTONS,
  };
  constructor(protected modalService: ModalService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private reportService: ReportsService
  ) { }
  

  templateHtml: any = "";
  To: string = 'all-branchtrainers@lge.com;all-trainingmanagers@lge.com';
  CC: any
  isSubmitted: boolean = false;
  @ViewChild('cancel', { static: false }) cancelButton!: ElementRef;
  public isMenu: boolean = false
  SelectedTerritory: any
  FromDate: any
  ToDate: any
  TrainingCode: any
  TrainedAudience: any
  Branch: any
  CurrentStatus: any
  CountType: any
  TrainedBy: any
  StartDOJ: any
  EndDOJ: any
  PCGList: any
  AllPCG:any
  AllPcgArr:any
  dashboardData: any
  trainedList: any[] = []
  bramnchesArr: any[] = []
  PendingListObj:any
  branches = [{ BRANCHNAME: '', BRANCHCODE: '' ,BRANCHID:''}];
  dateOfJoiningType: any
  pendingList: any
  pendingListNew: any
  modifiedData: any[] = []
  userList: any
  emailTemplates: any
  subject!: string
  sortedData: any
  DesignationID: any
  roleName: string = ''
  loggedInUserID: any
  
  isLoader: boolean = true
  userId: any
  trainingCodes:any
  ngOnInit(): void {
    this.DesignationID = sessionStorage.getItem("DesignationID");
    if (this.DesignationID == '202'||this.DesignationID == '262') {
      this.roleName = 'ADMIN'
    }
    else if (this.DesignationID == '122') {
      this.roleName = 'TRAINEE'
    }
    this.loggedInUserID = sessionStorage.getItem("UserId")
    this.userId = sessionStorage.getItem("UserEmpID")
    this.SelectedTerritory = this.route.snapshot.queryParamMap.get('SelectedTerritory');
    this.FromDate = this.route.snapshot.queryParamMap.get('FromDate');
    this.ToDate = this.route.snapshot.queryParamMap.get('ToDate');
    this.TrainingCode = this.route.snapshot.queryParamMap.get('TrainingCode');
    this.TrainedAudience = this.route.snapshot.queryParamMap.get('TrainedAudience');
    this.Branch = this.route.snapshot.queryParamMap.get('Branch');
    this.CurrentStatus = this.route.snapshot.queryParamMap.get('CurrentStatus');
    this.CountType = this.route.snapshot.queryParamMap.get('CountType');
    this.TrainedBy = this.route.snapshot.queryParamMap.get('TrainedBy');
    this.StartDOJ = this.route.snapshot.queryParamMap.get('StartDOJ')
    this.EndDOJ = this.route.snapshot.queryParamMap.get('EndDOJ')
    this.PCGList = this.route.snapshot.queryParamMap.get('PCGList')
    this.dateOfJoiningType = this.route.snapshot.queryParamMap.get('DateOfJoiningType')
  this.getPCGList();
    this.getBranches()
    this.getUserList()

    this.getEmailTemplates()
    this.subject = "Promoter Training Dashboard - <Product Name> - " + this.FromDate + " onwards."
  }
  getBranches() {

    this.commonService.getBranches(this.roleName, this.loggedInUserID).subscribe(data => {
     
      this.branches = data;
      this.getTrainingCode()

    }, error => {


    });

  }
  getTrainingCode() {
    this.commonService.getTrainingCodes().subscribe(data => {

      this.trainingCodes = data
      this.getData()
    })
  }

  templateChange() {
debugger
    this.content = this.templateHtml
    var rowsDesign =''
    var headerDesign = ''
    // var rowsDesign = ' <div class="row mx-0 cstmtable_head flex-nowrap" style=";display:flex;border-left: 1px solid white;">  <div class="col-2 text-center" style=" max-width: 160px; width: 100%;background-color: #A50032;color: white;padding: 8px 5px;border-right: 1px solid white;font-size: 14px;font-weight: 700;">  Zone</div> '
    // if(this.SelectedTerritory!="Zone") 
    //   rowsDesign+= '<div class="col-2 text-center" style=" max-width: 160px; width: 100%;background-color: #A50032;color: white;padding: 8px 5px;border-right: 1px solid white;font-size: 14px;font-weight: 700;">   Region</div>' 
    // if(this.SelectedTerritory!="Zone" && this.SelectedTerritory!="Region")
    // rowsDesign+=' <div class="col-2 text-center"  style=" max-width: 160px; width: 100%;background-color: #A50032;color: white;padding: 8px 5px;border-right: 1px solid white;font-size: 14px;font-weight: 700;">  Branch</div> '
    // rowsDesign+= ' <div class="col-2 text-center"  style=" max-width: 160px; width: 100%;background-color: #A50032;color: white;padding: 8px 5px;border-right: 1px solid white;font-size: 14px;font-weight: 700;"> Training Completed</div>  <div class="col-2 text-center"  style=" max-width: 160px; width: 100%;background-color: #A50032;color: white;padding: 8px 5px;border-right: 1px solid white;font-size: 14px;font-weight: 700;">  Training Pending</div> <div class="col-2 text-center"  style=" max-width: 160px; width: 100%;background-color: #A50032;color: white;padding: 8px 5px;border-right: 1px solid white;font-size: 14px;font-weight: 700;"> To be Trained</div> </div>'

    // this.sortedData.forEach((element: any) => {
    //   rowsDesign += '   <div class="d-flex    cstm-Table  flex-nowrap"  style=" display:flex;border-left: 1px solid rgb(198, 203, 211);"> <div class="col-2" style=" margin: 0;  border-right: 1px solid rgb(198, 203, 211);  border-bottom: 1px solid rgb(198, 203, 211);   display: flex;  align-items: center;  padding:6px 10px; max-width: 160px; width: 100%;">'
    //   rowsDesign += element.ZoneName + '</div><div class="  col-10 px-0">'

    //   element.Data.forEach((element2: any) => {
    //     if(this.SelectedTerritory!="Zone") {
    //     rowsDesign += '<div class="row  mx-0 flex-nowrap" style="display:flex"> <div class="col-2" style=" margin: 0; border-right: 1px solid rgb(198, 203, 211); border-bottom: 1px solid rgb(198, 203, 211); display: flex;  align-items: center; padding:6px 10px; max-width: 160px; width: 100%;">'
    //     rowsDesign += element2.RegionName + '</div>'
    //     }
    //     rowsDesign+='<div class="col-10 px-0">'
    //     element2.Data.forEach((element3: any) => {
    //       rowsDesign += '<div class=" row w-100 mx-0" style="display:flex"> '
    //       if(this.SelectedTerritory!="Zone" && this.SelectedTerritory!="Region"){
    //       rowsDesign+= ' <p class="col-3" style=" margin: 0;border-right: 1px solid rgb(198, 203, 211); border-bottom: 1px solid rgb(198, 203, 211); display: flex;align-items: center;padding:6px 10px;max-width: 160px;width: 100%;">'
    //       rowsDesign += element3.Branch + '</p>'}
    //       rowsDesign += '<p class="col-3 justify-content-center" style=" margin: 0; border-right: 1px solid rgb(198, 203, 211); border-bottom: 1px solid rgb(198, 203, 211); display: flex; align-items: center;  padding:6px 10px;  max-width: 160px;   width: 100%;">'
    //       rowsDesign += element3.TrainingCompleted + '</p>'
    //       rowsDesign += '<p class="col-3 justify-content-center" style=" margin: 0; border-right: 1px solid rgb(198, 203, 211); border-bottom: 1px solid rgb(198, 203, 211); display: flex; align-items: center;  padding:6px 10px; max-width: 160px; width: 100%;">'
    //       rowsDesign += element3.TrainingPending + '</p>'
    //       rowsDesign += '<p class="col-3 justify-content-center" style=" margin: 0;  border-right: 1px solid rgb(198, 203, 211);border-bottom: 1px solid rgb(198, 203, 211);  display: flex;align-items: center; padding:6px 10px; max-width: 160px; width: 100%;">'
    //       rowsDesign += element3.TotalToBeTrained + '</p></div>'
    //     });
    //     rowsDesign += '</div></div>'
    //   })
    //   rowsDesign += '</div></div>'
    // })

//     this.sortedData.forEach((element: any) => {
//       rowsDesign += ' <tr>'
//       rowsDesign += '<td>'+element.ZoneName + '</td>'
// rowsDesign += '<td colspan="4" class="no-padding" style="padding: 0 0 0 0;">'
//          rowsDesign += '<table style="width: 100%; border-collapse: collapse;"> '
//       element.Data.forEach((element2: any) => {
       
//          rowsDesign+='<tr>'
//          rowsDesign += '<td class="no-table-border" style="width: 20%; border: 0px !important; border-top: 1px solid #ddd !important;">'
//          +element2.RegionName+'</td>'
//           rowsDesign += '<td class="no-table-border" style="width: 80%; padding: 0px;  border: 0px;">'  
//           rowsDesign += '<table  style="width: 100%; border-collapse: collapse; border-top: none !important;"> '
//         element2.Data.forEach((element3: any) => {
//           rowsDesign += '<tr>'
//           rowsDesign += '<td class="border-top-none" style="border-top: none;">'
//           rowsDesign += element3.Branch+'</td>'
//           rowsDesign += '<td class="border-top-none" style="border-top: none;">'
//           rowsDesign += element3.TrainingCompleted+'</td>'
//           rowsDesign += '<td class="border-top-none" style="border-top: none;">'
//           rowsDesign += element3.TrainingPending +'</td>'
//           rowsDesign += '<td class="border-top-none border-right-none"   style="border-top: none; border-right: none;">'
//           rowsDesign += element3.TotalToBeTrained + '</td>'
//           rowsDesign += '</tr>'
       
//         });
//         rowsDesign += '</table> </td> </tr>  '
//       })
//       rowsDesign += '</table> </td> </tr>'
//     })

headerDesign += ' <th class="border-top-none border-bot-none" style="border-top: 0px; border-bottom: 0px; font-size: 14px; background-color: #A50032; color: #fff; border-right-color: #fff; height: 22px;">Zone</th> '
if(this.SelectedTerritory!='Zone')
{
  headerDesign += ' <th  class="border-top-none border-bot-none" style="border-top: 0px; border-bottom: 0px; font-size: 14px; background-color: #A50032; color: #fff; border-right-color: #fff; height: 22px;">    Region</th>  '
}
if(this.SelectedTerritory!='Zone' && this.SelectedTerritory!='Region')
{
  headerDesign += ' <th  class="border-top-none border-bot-none"    style="border-top: 0px; border-bottom: 0px; font-size: 14px; background-color: #A50032; color: #fff; border-right-color: #fff; height: 22px;">    Branch</th> ' 
}

this.sortedData.forEach((element: any) => {
  rowsDesign += ' <tr style="padding: 0% !important; ">'
  rowsDesign += '<td>'+element.ZoneName + '</td>'
  rowsDesign += '<td colspan="5">'
  rowsDesign += '<table style="width: 100%;">'
  rowsDesign += '<tbody>'

  element.Data.forEach((element2: any) => {
    
     rowsDesign += '<tr>'
     if(this.SelectedTerritory != 'Zone')
      {
        rowsDesign+=' <td style="width: 20%;">' +element2.RegionName+'</td> '
      }     
      rowsDesign += ' <td style="width: 80%; padding: 0px !important; border: none;"> '  
      rowsDesign += ' <table width="100%" style="width: 100%;"> '
      rowsDesign += '  <tbody> '
      element2.Data.forEach((element3: any) => {
        rowsDesign += '<tr>'
        if(this.SelectedTerritory!='Zone' && this.SelectedTerritory!='Region')
        rowsDesign += '<td>'+ element3.Branch+'</td>'
        rowsDesign += '<td>'+element3.TrainingCompleted+'</td>'
        rowsDesign += '<td>'+element3.TrainingPending +'</td>'
        rowsDesign += '<td>'+element3.TotalToBeTrained + '</td>'
        rowsDesign += '</tr>'
    
      });
    rowsDesign += '</tbody> </table> </td> </tr>'
  })
  rowsDesign += '  </tbody> </table> </td> </tr> '
})

    this.content = this.content.replace("{{~th}}",headerDesign)
    this.content = this.content.replace("{{~tr}}", rowsDesign)
    this.content = this.content.replace("{{~trainedAudience}}", this.TrainedAudience == "0" ? "All" : this.TrainedAudience)
    this.content = this.content.replace("{{~countType}}", this.CountType == "0" ? "All" : this.CountType)
    this.content = this.content.replace("{{~doj}}", this.dateOfJoiningType == "0" ? "All" : this.StartDOJ)
    this.content = this.content.replace("{{~trainingCode}}", this.TrainingCode == "0" ? "All" : this.TrainingCode)
    this.content = this.content.replace("{{~currentStatus}}", this.CurrentStatus == "2" ? "All" : this.CurrentStatus == "1" ? "InActive" : "Active")
    this.content = this.content.replace("{{~pcg}}", this.PCGList == "0" ? "All" : this.PCGList)
    this.content = this.content.replace("{{~startDate}}", this.FromDate)
    this.content = this.content.replace("{{~endDate}}", this.ToDate)
  }

  keyUp(event: any) {

  }
  toggleMenuAction(menu: boolean) {
    this.isMenu = menu
  }

  getData() {
    
    var allBranch = this.branches.map((item:any) => item.BRANCHID)
    var allBrancheId = allBranch.join(',')
    var branchArr = this.Branch.split("|")
    var newBranches = "";
    var modifiedBRanchArr: (string | undefined)[] = []
    if(branchArr.length>1)
    {
      branchArr.forEach((element:any) => {
        var branchId = this.branches.find(x=>x.BRANCHNAME==element)?.BRANCHID
        modifiedBRanchArr.push(branchId)
      });
      newBranches= modifiedBRanchArr.join(',')
    }
    else if(branchArr[0]=="0"){
      newBranches = allBrancheId
    }
    else{
      var branchId = this.branches.find(x=>x.BRANCHNAME==branchArr[0])?.BRANCHID
      newBranches= branchId==undefined?"0":branchId
    }




    var alltrainingCode = this.trainingCodes.map((item:any) => item.TRAINING_CODE)
    var alltrainingCodeId = alltrainingCode.join("','")
    var trainingCodeArr = this.TrainingCode.split("|")
    var newTrainingCodes = "";
    var modifiedTrainingCodeArr: (string | undefined)[] = []
    if(trainingCodeArr.length>1)
      {
        trainingCodeArr.forEach((element:any) => {
          var trainingCodeId = this.trainingCodes.find((x:any)=>x.TRAINING_CODE==element)?.TRAINING_CODE
          modifiedTrainingCodeArr.push(trainingCodeId)
        });
        newTrainingCodes= modifiedTrainingCodeArr.join("','")
      }
      else if(trainingCodeArr[0]=="0"){
        newTrainingCodes = alltrainingCodeId
      }
      else{
        var trainingCode = this.trainingCodes.find((x:any)=>x.TRAINING_CODE==trainingCodeArr[0])?.TRAINING_CODE
        newTrainingCodes= trainingCode==undefined?"0":trainingCode
      }
      var newPCG = "";
      if(this.PCGList !="0")
      {
        newPCG = this.PCGList.replaceAll("|","','")
        newPCG = "'"+newPCG+"'"
      }
      else{
        newPCG = "0"
      }
      newTrainingCodes ="'"+newTrainingCodes+"'"
    var allBranch = this.branches.map((item:any) => item.BRANCHID)
    var allBrancheId = allBranch.join(',')



this.reportService.GetPendingList(this.Branch=="0"?"0":"'"+this.Branch.replaceAll("|","','")+"'",
this.PCGList=="0"?"0":"'"+this.PCGList.replaceAll("|","','")+"'").subscribe(data=>{
this.PendingListObj = data;

})

    this.reportService.GetSSEDashboard(
      this.convertDate(this.FromDate), 
      this.convertDate(this.ToDate),
      this.StartDOJ == "" ? "" : this.convertDate(this.StartDOJ),
       this.EndDOJ == "" ? "" : this.convertDate(this.EndDOJ),
      this.TrainedAudience,
       newBranches,
      newTrainingCodes,
      this.TrainedBy=="0"?"0": "'"+this.TrainedBy.replaceAll("|","','")+"'",
      this.CountType,
       this.PCGList == "0"? "0":newPCG ,
      // this.PCGList == "0"?"'"+ this.AllPcgArr.join("','") + "'":newPCG ,
      this.CurrentStatus,
       this.dateOfJoiningType, 
       this.roleName, 
       this.userId
    ).subscribe(data => {
  
// this.PendingListObj.forEach((element:any)=>{
//   data?.SSETrainingReports.push(element)
// })
var modData: any[] = []
var mainData = data?.SSETrainingReports.filter((x:any)=>x.Designation.toUpperCase() =="SSE")
mainData.forEach((x:any)=>{
  if(modData.length==0)
    modData.push(x)
  else if( x.ParticipantEmployeeId =="" ||  x.ParticipantEmployeeId ==null)
    modData.push(x)
  else{
    var chkData = modData.filter((a:any)=>a.ParticipantEmployeeId == x.ParticipantEmployeeId)
    if(chkData.length==0)
      modData.push(x)
  }
})
mainData=modData
      this.isLoader = false
      this.pendingList = []
      this.pendingListNew = []
      // this.pendingList = data.PendingList;
      this.trainedList = [];
      this.bramnchesArr = this.Branch.split('|')
      var pCount = 0
      if (this.bramnchesArr[0] == 0) {
        this.branches.forEach((element: any) => {
          
          var trained = mainData?.filter((x: any) => x.BranchCode == element.BRANCHCODE && (x.TrainerName !=null && x.TrainerName!=""))
          var total = mainData?.filter((x: any) => x.BranchName == element.BRANCHNAME)
          pCount = this.PendingListObj?.filter((x: any) => x.BranchName == element.BRANCHNAME  && (x.TrainerName ==null || x.TrainerName=="")).length
          var t = mainData?.filter((x: any) =>(x.PCG ==null || x.PCG==""))
          var p_Data = this.PendingListObj?.filter((x: any) => x.BranchName == element.BRANCHNAME  && (x.TrainerName ==null || x.TrainerName==""))
          p_Data?.forEach((element: any) => {
            this.pendingList.push(element)
          })

          var trainedCount = trained?.length
          var totalCount = trainedCount+(pCount==undefined?0:pCount)
          var regionName = ""
          var zoneName = ""
          var trainingCodeName = ""

          if(totalCount != 0 && total.length>0)
          {
            regionName =total[0].RegionName== "RO+UP"?"ROUP":total[0].RegionName
            zoneName = total[0].ZoneName
            trainingCodeName =total[0].TrainingCode
          }
          else if(totalCount != 0 && total.length==0){
            regionName =p_Data[0].RegionName== "RO+UP"?"ROUP":p_Data[0].RegionName
            zoneName = p_Data[0].ZoneName
            trainingCodeName =p_Data[0].TrainingCode
          }
          //var pendingCount = totalCount - trainedCount
          if (totalCount != 0) {
            var obj = {
              "Zone": zoneName,
              "Region":regionName,
              "Branch": element.BRANCHCODE,
              "TrainingCode": trainingCodeName,
              //"TrainingCompleted": trainedCount,
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

          var trained = mainData.filter((x: any) => x.BranchName == element && (x.TrainerName !=null && x.TrainerName!=""))
          var total = mainData.filter((x: any) => x.BranchName == element)
          //pCount = data?.SSETrainingReports.filter((x: any) => x.BranchName == element  && (x.TrainerName ==null || x.TrainerName=="")).length
          pCount = this.PendingListObj?.filter((x: any) => x.BranchName == element  && (x.TrainerName ==null || x.TrainerName=="")).length
          var p_Data = this.PendingListObj.filter((x: any) => x.BranchName == element  && (x.TrainerName ==null || x.TrainerName==""))
          p_Data.forEach((pelement: any) => {
            this.pendingList.push(pelement)
          })

          var trainedCount = trained?.length
          var totalCount = trainedCount+pCount
          //var pendingCount = totalCount - trainedCount
          var regionName = ""
          var zoneName = ""
          var trainingCodeName = ""
          var branchName =""
          if(totalCount != 0 && total.length>0)
          {
            regionName =total[0].RegionName== "RO+UP"?"ROUP":total[0].RegionName
            zoneName = total[0].ZoneName
            trainingCodeName =total[0].TrainingCode
            branchName = total[0].BranchCode
          }
          else if(totalCount != 0 && total.length==0){
            regionName =p_Data[0].RegionName== "RO+UP"?"ROUP":p_Data[0].RegionName
            zoneName = p_Data[0].ZoneName
            trainingCodeName =p_Data[0].TrainingCode
            branchName = p_Data[0].BranchCode
          }
          if (totalCount != 0) {
            var obj = {
              "Zone":zoneName,
              "Region": regionName,
              "Branch": branchName,
              "TrainingCode": trainingCodeName,
              //"TrainingCompleted": trainedCount,
              "TrainingCompleted": trainedCount,
              "TrainingPending": pCount,
              "TotalToBeTrained": totalCount

            }
            this.trainedList.push(obj)
          }
          // var trained = data?.SSETrainingReports.filter((x: any) => x.BranchName == element)
          // var total = data?.CurrentEmployees.filter((x: any) => x.BranchName == element)
          // pCount = data?.PendingList.filter((x: any) => x.BranchName == element).length


          // var trainedCount = trained?.length
          // var totalCount = total.length
          // //var pendingCount = totalCount - trainedCount
          // if (trainedCount != 0) {
          //   var obj = {
          //     "Zone": trained[0].ZoneName,
          //     "Region": trained[0].RegionName =="RO+UP"?"ROUP": trained[0].RegionName,
          //     "Branch": trained[0].BranchCode,
          //     "TrainingCode": trained[0].TrainingCode,
          //     // "TrainingCompleted": trainedCount,
          //     "TrainingCompleted": totalCount - pCount,
          //     "TrainingPending": pCount,
          //     "TotalToBeTrained": totalCount
          //   }
          //   this.trainedList.push(obj)
          // }

        });
      }


      this.sortData()
      // this.exportToExcel(this.trainedList)


    }, error => {
      this.isLoader = false
    })
  }

  exportToExcel(data: any) {

if(data?.length==0)
{
  alert("No Data Found");
}
    let excelData: any[] = [];

    data.forEach((x: any) => {
      var dataToExport: {}
      var pcgList = ['HA','HE','HEAE','HEHA','RAC','SA','WM','WP']
      // if(pcgList.includes(x.PCG.toUpperCase()))
      // {
      dataToExport = {
        "Zone": x.ZoneName,
        "Region": x.RegionName=="RO+UP"?"ROUP":x.RegionName,
        "Branch": x.BranchCode,
        "SSE PCG": x.PCG,
        // "Training Completed": x.TrainingCompleted,
        "SSE Id": x.ParticipantEmployeeId,
        "SSE Name": x.ParticipantName,
        //"TotalToBeTrained":x.TotalToBeTrained
      }
      //i = i + 1;
      excelData.push(dataToExport);
    //  }
    })

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'SSE Pending List.xlsx');
  }

  sendEmail() {

    this.isSubmitted = true;

    var cc = this.CC?.join(';');
    if (this.content == '<p><br></p>') {
      return
    }
    this.reportService.SendEmail(this.To, cc == undefined ? "" : cc, this.subject, this.content).subscribe((data: any) => {

      alert("Email has been sent")
      this.cancelButton.nativeElement.click()
    }, error => {

      alert("Oops something went wrong")
    })

  }


  sortData() {
    // if(this.trainedList.length == 0 && this.pendingList.length>0)
    //   this.trainedList = this.pendingList
    var modifiedSortedData: { Data: { Data: { Branch: string; Region: string; TotalToBeTrained: number; TrainingCode: string; TrainingCompleted: number; TrainingPending: number; Zone: any; }[]; RegionName: string; }[]; ZoneName: any; }[]=[]
    var newObj = null
    var Zones = this.trainedList.map(item => item.Zone)
      .filter((value, index, self) => self.indexOf(value) === index)

    var Regions = this.trainedList.map(item => item.Region)
      .filter((value, index, self) => self.indexOf(value) === index)

    var Branches = this.trainedList.map(item => item.Branch)
      .filter((value, index, self) => self.indexOf(value) === index)

    Zones = Zones.sort((a, b) => a.localeCompare(b))
    Regions = Regions.sort((a, b) => a.localeCompare(b))
    Branches = Branches.sort((a, b) => a.localeCompare(b))
    //this.modifiedData.push(Zones)



    var branchArr: { BranchName: any; Data: any[]; }[] = []
    Branches.forEach((e: any) => {
      var data = this.trainedList.filter((x: any) => x.Branch == e)
      var obj = {
        "BranchName": e,
        "Data": data
      }
      branchArr.push(obj)
    })

    var regionArr: { RegionName: any; Data: any[]; }[] = [];
    var tempRegionArr: any[] = [];
    Regions.forEach((e: any) => {
      branchArr.forEach((e1: any) => {

        if (e == e1.Data[0].Region) {

          tempRegionArr.push(e1.Data[0])
        }
      })
      var obj = {
        "RegionName": e,
        "Data": tempRegionArr
      }
      tempRegionArr = []
      regionArr.push(obj)
    })

    var zoneArr: any[] = []
    var tempZoneArr: { RegionName: any; Data: any[]; }[] = []

    Zones.forEach((x: any) => {

      var regions = this.trainedList.filter(y => y.Zone == x)
      var uRegions = regions.map(item => item.Region)
      uRegions = uRegions.sort((a, b) => a.localeCompare(b))
        .filter((value, index, self) => self.indexOf(value) === index)

      uRegions.forEach((d: any) => {
        var data = regionArr.filter((a: any) => a.RegionName == d)
        tempZoneArr.push(data[0])
      })
      var obj = {
        "ZoneName": x,
        "Data": tempZoneArr
      }
      zoneArr.push(obj)
      tempZoneArr = []
    })
    
    this.sortedData = zoneArr
    
    var ModifiedTrainingCompleted = 0;
    var ModifiedTrainingPending = 0;
    var ModifiedToBeTrained = 0;
   
    if (this.SelectedTerritory == "Zone") {
      this.sortedData.forEach((element: any) => {
        element.Data.forEach((element2: any) => {
          element2.Data.forEach((element3: any) => {
            ModifiedTrainingCompleted += element3.TrainingCompleted
            ModifiedTrainingPending += element3.TrainingPending
            ModifiedToBeTrained += element3.TotalToBeTrained
          });
        });
        var obj = [{
          Branch: "DEL",
          Region: "DELHI",
          TotalToBeTrained: ModifiedToBeTrained,
          TrainingCode: "",
          TrainingCompleted: ModifiedTrainingCompleted,
          TrainingPending: ModifiedTrainingPending,
          Zone: element.ZoneName
        }]
        var obj2 = [{
          Data:obj,
          RegionName:""
        }]
        var obj3 = {
          Data:obj2,
          ZoneName:element.ZoneName
        } 
        modifiedSortedData.push(obj3)
        ModifiedTrainingCompleted = 0;
        ModifiedTrainingPending = 0;
        ModifiedToBeTrained = 0;
      });
      this.sortedData = modifiedSortedData

    }
    else if (this.SelectedTerritory == "Region")
    {
      
      this.sortedData.forEach((element: any) => {
        element.Data.forEach((element2: any) => {
          element2.Data.forEach((element3: any) => {
            ModifiedTrainingCompleted += element3.TrainingCompleted
            ModifiedTrainingPending += element3.TrainingPending
            ModifiedToBeTrained += element3.TotalToBeTrained
          });
          var obj = [{
            Branch: "DEL",
            Region: "DELHI",
            TotalToBeTrained: ModifiedToBeTrained,
            TrainingCode: "",
            TrainingCompleted: ModifiedTrainingCompleted,
            TrainingPending: ModifiedTrainingPending,
            Zone: element.ZoneName
          }]
          var obj2 = [{
            Data:obj,
            RegionName:element2.RegionName
          }]
          var obj3 = {
            Data:obj2,
            ZoneName:element.ZoneName
          } 
          modifiedSortedData.push(obj3)
          ModifiedTrainingCompleted = 0;
          ModifiedTrainingPending = 0;
          ModifiedToBeTrained = 0;
        });
        
      });
      this.sortedData = modifiedSortedData
    }


  }

  getUserList() {
    this.commonService.getUserForCC().subscribe(data => {

      this.userList = data;
    }, error => {

    })
  }

  getEmailTemplates() {
    this.reportService.GetEmailTemplates().subscribe(data => {


      this.emailTemplates = data
    })
  }

  convertDate(date: string) {

    var daterArr = date.split('/')
    if (daterArr.length == 1)
      return date
    return daterArr[2] + '-' + daterArr[1] + '-' + daterArr[0]
  }

  getPCGList() {
    this.commonService.getPCG().subscribe(data => {

      this.AllPCG = data;
      
      this.AllPcgArr = this.AllPCG.map((x:any)=>x.PCGlist)
    }, error => {

    })
  }
}
