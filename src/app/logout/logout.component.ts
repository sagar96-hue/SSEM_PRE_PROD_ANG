import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private loginService:LoginService) { }
  @ViewChild('logoutBtn', { static: false }) logoutButton!: ElementRef;
  ngOnInit(): void {
    this.loginService.logOut()
    
    this.logoutButton?.nativeElement.click();

    setTimeout(() => {
      window.location.href = "http://10.101.0.90:1696/Pages/LoginPage.aspx"
    }, 5000);
  }

}
