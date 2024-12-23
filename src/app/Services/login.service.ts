import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiURL = ''
  userName: any
  userEmail: any
  pageName:any
  isUserAuthenticated: boolean = false
  constructor(private httpclient: HttpClient,
    private route: ActivatedRoute,
  private router:Router) {
    this.apiURL = environment.apiUrl;
  }

  generateToekn(userName: string) {
    return this.httpclient.post(this.apiURL + 'Login/GenerateToken?username=' + userName, {  "username": userName })
  }

  checkUserAuthenticated() {
    if (sessionStorage.getItem("Token") != null)
      this.isUserAuthenticated = true
    return this.isUserAuthenticated
  }
  checkLogin() {
    
    this.userName = this.route.snapshot.queryParamMap.get('username');
    //this.userEmail = this.route.snapshot.queryParamMap.get('useremail')
    this.pageName = this.route.snapshot.queryParamMap.get('pagename')
    const token = sessionStorage.getItem("Token") 

    if (token == null||token == undefined||token == ''  ||token == 'undefined'){
      if(this.userName!=null ){
        this.generateToekn(this.userName).subscribe((data: any) => {
          
          sessionStorage.setItem("DesignationID", data.DesignationID)
          sessionStorage.setItem("EmailID", data.EmailID)
          sessionStorage.setItem("Token", data.Token)
          sessionStorage.setItem("UserEmpID", data.UserEmpID)
          sessionStorage.setItem("UserName", data.Username)
          sessionStorage.setItem("UserId", data.Userid)  
          sessionStorage.setItem("DateOfJoining", data.DateOfJoining)
          this.router.navigateByUrl("/"+this.pageName)
        },err=>{
          
          
          this.logOut()
          //window.location.href="http://10.101.0.136:1602/Pages/LoginPage.aspx"
         //this.router.navigateByUrl("/logout")
        })
      }
    }
     else{
      
      this.router.navigateByUrl("/"+this.pageName)
     }
    
      //else this.logOut()
  }

logOut()
{
  sessionStorage.removeItem("Token");
  sessionStorage.removeItem("DesignationID");
  sessionStorage.removeItem("EmailID");
  sessionStorage.removeItem("UserEmpID");
  sessionStorage.removeItem("UserName");
  sessionStorage.removeItem("UserId");
  //this.router.navigateByUrl("/logout")
}
internelLogout()
{
  sessionStorage.removeItem("Token");
  sessionStorage.removeItem("DesignationID");
  sessionStorage.removeItem("EmailID");
  sessionStorage.removeItem("UserEmpID");
  sessionStorage.removeItem("UserName");
  sessionStorage.removeItem("UserId");
  window.location.href="http://10.101.0.90:1696/Pages/LoginPage.aspx"
}

  login(userName: string, passWord: string) {

  }

  sendOTP( email: string,username:string) {
    
   return this.httpclient.post(this.apiURL+"Login/SendOTP?Email="+email+"&UserName="+username,{})
  }
  validateOTP(empId: string|null, OTP: string) {
    return this.httpclient.post(this.apiURL+"Login/ValidateOTP?EmpID="+empId+"&OTP="+OTP,{})
  }
  updatePassword(userId: string|null, password: string) {  
    return this.httpclient.post(this.apiURL+"Login/UpdatePassword?EmpID="+userId+"&Password="+password,{})
  }

}
