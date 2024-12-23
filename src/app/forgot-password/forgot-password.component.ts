import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { LoginService } from '../Services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private loginService:LoginService,
    private router:Router,
    private route: ActivatedRoute) { }

  isOtp:boolean=false
  isUpdatePassword:boolean=false
  email:string=''
  userName:string = ''
  isSubmitted:boolean=false
  isInit:boolean=true
  userId:string|null="";
  OTP:string=''
  empId:string|null=''
  isOtpValidated:string|null='';
  password:string = ""
  confirmPassword:string = ""
  ngOnInit(): void {
    
    this.userId = this.route.snapshot.queryParamMap.get('EmpId');
    this.isOtpValidated = this.route.snapshot.queryParamMap.get('IsOTPVerified');
    if(this.userId!=null && this.userId!="" && this.userId!="0" && (this.isOtpValidated=="" || this.isOtpValidated==null ))
    {
      this.isInit=false;
      this.isOtp = true
    }
    else if(this.isOtpValidated=="" || this.isOtpValidated!=null)
    {
      this.isUpdatePassword = true;
      this.isInit=false;
      this.isOtp = false
    }
  }

  sendOtp()
  {
    
    this.isSubmitted = true
    if(this.email==""|| this.userName =="")
      return
    this.loginService.sendOTP(this.email,this.userName).subscribe(data=>{
      
      if(data!="0"){
        this.router.navigate(['/forgot-password'],{queryParams:{
          EmpId:data
        }});
        this.isInit=false;
        this.isOtp = true
        this.userId=data.toString();
        alert("OTP has been sent to your email.");
      }
      else{
        alert("Please enter correct details.")
      }
    })
  }

validateOTP()
{
  
  this.isSubmitted=true;
  if(this.OTP=="") return
  this.loginService.validateOTP(this.userId,this.OTP).subscribe(data=>{
    
    if(data=="Matched")
    {
      this.router.navigate(['/forgot-password'],{queryParams:{
        EmpId:this.userId,
        IsOTPVerified:"true"
      }});
      this.isUpdatePassword = true;
      this.isInit=false;
      this.isOtp = false
    }
    else{
      alert("Please enter correct OTP.")
    }
  })

}
 
updatePassword()
{
  this.isSubmitted=true;
  if(this.password=="" || this.confirmPassword=="")
    {
      return
    }
  if(this.password!=this.confirmPassword)
  {
    alert("password and confirm password are not same")
    return
   
  }
  
  this.loginService.updatePassword(this.userId,this.password).subscribe(data=>{
    alert(data);
     window.location.href ="http://10.101.0.90:1696/Pages/LoginPage.aspx"
  },(err=>{
    alert("Oops something went wrong")
  }))

}
 
}
