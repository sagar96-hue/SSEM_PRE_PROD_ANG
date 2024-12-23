import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {


  apiURL = ''

  constructor(public http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }
  getBranches(userRole:string,userLoginId:string) {

    return this.http.get<any>(this.apiURL + "Common/GetBranchList?role="+userRole+'&trainerId='+userLoginId);

  }
  getProfile() {

    return this.http.get<any>(this.apiURL + "Common/GetProfileList");

  }
  getTrainingCodes() {

    return this.http.get<any>(this.apiURL + "Common/GetTrainingCodeList");

  }

  getTrainers() {
    return this.http.get<any>(this.apiURL + "Common/GetTrainersList");
  }

  getTrainingMedium() {
    return this.http.get<any>(this.apiURL + "Common/GetTrainingMediumList")
  }

  getTrainingAudience() {
    return this.http.get<any>(this.apiURL + "Common/GetTrainingAudienceList")
  }
  getRegions() {
    return this.http.get<any>(this.apiURL + "Common/GetRegionList")
  }
  getPCG() {
    return this.http.get<any>(this.apiURL + "Common/GetPCGList")
  }

  getUserList() {
    return this.http.get<any>(this.apiURL + "Common/GetUserList")
  }

  getDataBySSEId(sseId: any) {
    return this.http.get<any>(this.apiURL + "Master/GetSSEIDData?sseid=" + sseId)
  }
  getTrainersForSSE() {
    return this.http.get<any>(this.apiURL + "Common/GeTrainersList");
  }

  getUserForCC() {
    return this.http.get<any>(this.apiURL + "Master/GetTrainerforcc")
  }



}
