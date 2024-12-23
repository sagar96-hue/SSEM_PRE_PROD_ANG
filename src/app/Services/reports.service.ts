import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  apiURL=''
  constructor(private httpclient:HttpClient) { 
    this.apiURL = environment.apiUrl;
  }

  GetTrainingDeliveryReport(branches:string,designation:string,trainingCode:string,startDate:string,endDate:string,role:string,trainerId:string|null)
  {
    let formData: FormData = new FormData();
    formData.append('trainingCode', trainingCode);
   return this.httpclient.post<any>(this.apiURL+'Master/GetTrainingCodeReport?branchIds='+branches+'&designation='
    +designation+
    // '&trainingCode='+trainingCode+
    '&startDate='+startDate+'&endDate='+endDate+'&role='+role+'&trainerId='+trainerId,formData)
  }

  GetSSETrainingReport(startDate:string,endDate:string,startDoj:string,endDoj:string,
    trainedAudience:string,branch:string,trainingCode:string,trainedBy:string,countType:string,
    pcglist:string,currentStatus:string,dateOfJoiningType:any,role:string,userId:string )
  {
    
   return this.httpclient.get<any>(this.apiURL+'Master/GetSSETrainingReport?p_StartDate='+
    startDate+'&p_EndDate='+endDate+(dateOfJoiningType==0? '&p_Start_DOJ='+startDoj+'&p_End_DOJ='+endDoj:'')+
    '&p_TrainedAudience='+trainedAudience+'&p_Branch='+branch+'&p_TrainingCode='+trainingCode+
    '&p_TrainedBy='+trainedBy+'&p_CountType='+countType+'&p_pcglist='+pcglist+
    '&p_currentstatus='+currentStatus+'&p_role='+role+'&p_trainerid='+userId)
  }

  GetSSEDashboard(startDate:string,endDate:string,startDoj:string,endDoj:string,
    trainedAudience:string,branch:string,trainingCode:string,trainedBy:string,countType:string,
    pcglist:string,currentStatus:string,dateOfJoiningType:any,role:string,userId:string )
  {
    
    let formData: FormData = new FormData();
    formData.append('p_TrainingCode', trainingCode);
   return this.httpclient.post<any>(this.apiURL+'Master/GetSSEDashboard?p_StartDate='+
    startDate+'&p_EndDate='+endDate+(dateOfJoiningType==1? '&p_Start_DOJ='+startDoj+'&p_End_DOJ='+endDoj:'')+
    '&p_TrainedAudience='+trainedAudience+'&p_Branch='+branch+'&p_TrainingCode='+trainingCode+
    '&p_TrainedBy='+trainedBy+'&p_CountType='+countType+'&p_pcglist='+pcglist+
    '&p_currentstatus='+currentStatus+'&p_role='+role+'&p_trainerid='+userId,formData)
  }

  SavePJPEvent(pjP_ID:number,pjP_DATE:string,traininG_MEDIUM:string,traininG_CODE:string,
    traininG_AUDIENCE:string,expecteD_AUDIENCE_COUNT:number,userId:any)
  {
    
    return this.httpclient.post(this.apiURL+'AjpPjp/CreatePJPReport',{"pjP_ID":pjP_ID,"pjP_DATE":pjP_DATE,traininG_MEDIUM:traininG_MEDIUM,
      "traininG_CODE":traininG_CODE,"expecteD_AUDIENCE_COUNT":expecteD_AUDIENCE_COUNT,"traininG_AUDIENCE":traininG_AUDIENCE,"traineR_ID":userId
    })
  }

  GetPJPReport(pjpDate:string,trainerId:any)
  {
    
    return this.httpclient.get<any>(this.apiURL+'AjpPjp/GetPJPReport?pjpDate='+pjpDate+'&trainerid='+trainerId)
  
  }

  UpdatePJPEvent(pjP_ID:number,pjP_DATE:string,traininG_MEDIUM:string,traininG_CODE:string,
    traininG_AUDIENCE:string,expecteD_AUDIENCE_COUNT:number , userId:any)
  {
    
    return this.httpclient.post(this.apiURL+'AjpPjp/UpdatePJPReport',{"pjP_ID":pjP_ID,"pjP_DATE":pjP_DATE,traininG_MEDIUM:traininG_MEDIUM,
      "traininG_CODE":traininG_CODE,"expecteD_AUDIENCE_COUNT":expecteD_AUDIENCE_COUNT,"traininG_AUDIENCE":traininG_AUDIENCE,"traineR_ID":userId
    })
  }

  DeletePJPReport(pjP_ID:string)
  {
    
    return this.httpclient.get(this.apiURL+"AjpPjp/DeletePJPReport/"+pjP_ID)
  }

  GetPJPReportForDownload(month:number,year :number, region :any)
  {
    
    return this.httpclient.get(this.apiURL+"AjpPjp/GetPJP?month="+month+'&year='+year+"&regionId="+region);
  }

  GetPJPReportForDownloadForTrainer(month:number,year :number, branch :any,userId:string)
  {
    
    return this.httpclient.get(this.apiURL+"AjpPjp/GetPJPTrainee?month="+month+'&year='+year+"&branchId="+branch+'&trainerId='+userId);
  }

  GetAJPReport(date:string,region:string,branch:string,role:string,userid:string)
  {    
    return this.httpclient.get(this.apiURL+"AjpPjp/GetAjpReport?date="+date+"&region="+region+"&branch="+branch+"&role="+role+"&userid="+userid);
  }
  GetAJPReportForTrainer(date:string,branch:string,trainerId:string)
  {
    
    return this.httpclient.get(this.apiURL+"AjpPjp/GetAjpTraineeReport?date="+date+"&branch="+branch+'&trainerId='+trainerId);
  }
  GetAJPPJPReport(date:string,region:string,branch:string,role:string,empid:string)
  {
    
    return this.httpclient.get(this.apiURL+"AjpPjp/GetAjpPjpReport?reportDate="+date+"&region="+region+"&branch="+branch+"&role="+role+"&empid="+empid);
  }
  GetAJPPJPReportForTrainer(date:string,branch:string,trainerId:string)
  {
    
    return this.httpclient.get(this.apiURL+"AjpPjp/GetAjpPjpTraineeReport?reportDate="+date+"&branch="+branch+'&trainerId='+trainerId);
  }
  ViewPjpAjpReport(date:string,region:string)
  {
    
    return this.httpclient.get(this.apiURL+"AjpPjp/GetAjpPjpDashboard?reportDate="+date+"&region="+region);
  }
  ViewPjpAjpReportForTrainer(date:string,branch:string,trainerId:string)
  {
    
   // return this.httpclient.get('https://localhost:44306/api/AjpPjp/GetAjpPjpDashboardTrainee?reportDate=2024-10-01&branchids=0&trainerId=004455')
    return this.httpclient.get(this.apiURL+"AjpPjp/GetAjpPjpDashboardTrainee?reportDate="+date+"&branchids="+branch+'&trainerId='+trainerId);
  }
  GetEmailTemplates()
  {
    return this.httpclient.get(this.apiURL+"Email/GetEMailTemplates");
  }

  SendEmail(to:string,cc:string,subject:string,content:string)
  {
  
    let formData: FormData = new FormData();
    formData.append('message', content);
    var new_url=this.apiURL+'Email/SendEmail?to='+to+(cc!=''?'&cc='+cc:'&cc=N/A')+'&subject='+subject

    return this.httpclient.post(new_url,formData)
   
  }

  upload(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.httpclient.post(this.apiURL+'Master/UploadExcel', formData);
  }

  GetAjpPjpDashboard(date:string,region:string,branch:string,role:string,userempid:string)
  {
    return this.httpclient.get(this.apiURL+"AjpPjp/GetAjpPjpDashboardNew?reportDate="+date+"&regionIds="+region+"&branch="+branch+"&role="+role+"&userId="+userempid)
  }

  GetPendingList(branch:string,pcg:string)
  {
    return this.httpclient.get(this.apiURL+"Master/GetPendingList?Branch="+branch+"&PCG="+pcg);
  }
}
