import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgNotFoundTemplateDirective } from '@ng-select/ng-select';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit  {
  @Output() menu = new EventEmitter<boolean>();
  public isMenuVisible: boolean = false;
  userName:string|null=''
  ngOnInit(): void {
    
    this.userName = sessionStorage.getItem("UserName")
    
  }
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
    this.menu.emit(this.isMenuVisible);
  }

  logout()
  {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("DesignationID");
    sessionStorage.removeItem("EmailID");
    sessionStorage.removeItem("UserEmpID");
    sessionStorage.removeItem("UserName");
    sessionStorage.removeItem("UserId");
    window.location.href="http://10.101.0.90:1696/Pages/LoginPage.aspx"
    
  }
}
