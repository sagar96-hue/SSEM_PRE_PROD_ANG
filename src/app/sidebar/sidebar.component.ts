import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit,OnInit {
  @Input() menu: boolean | undefined;
  @Output() sidebarView = new EventEmitter<boolean>();
  public isCollapsed = true;
  public toggleNav: boolean = false;
  DesignationID:string|null=''
  roleName:string=''
  constructor(private renderer: Renderer2) { }
ngOnInit(): void {
  this.DesignationID = sessionStorage.getItem("DesignationID");
  if (this.DesignationID == '202'||this.DesignationID == '262') {
    this.roleName = 'ADMIN'
  }
  else if (this.DesignationID == '122') {
    this.roleName = 'TRAINEE'
  }
}
  ngAfterViewInit(): void {
    const navLinks = document.querySelectorAll('.nav-link');
 
    navLinks.forEach(navLink => {
      this.renderer.listen(navLink, 'click', () => {
 //button-toggle-menu
        const toggleIcon = navLink.querySelector('.toggle-icon') as HTMLImageElement;

        if (navLink.classList.contains('collapsed')) {
          this.renderer.setAttribute(toggleIcon, 'src', '../../assets/images/plus.svg');
        } else {
          this.renderer.setAttribute(toggleIcon, 'src', '../../assets/images/dash.svg');
        }

        navLinks.forEach(otherNavLink => {
          if (otherNavLink !== navLink) {
            otherNavLink.classList.add('collapsed');
            const otherToggleIcon = otherNavLink.querySelector('.toggle-icon') as HTMLImageElement;
            if (otherToggleIcon) {
              this.renderer.setAttribute(otherToggleIcon, 'src', '../../assets/images/plus.svg');
            }
          }
        });
      });
    });
  }

  toggleNavbar(){
    if(document.querySelector('.main-menu')?.classList.contains('hide-menu')){
      this.toggleNav = !this.toggleNav;
      this.sidebarView.emit(this.toggleNav);
    }
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
    // this.router.navigateByUrl("/logout")
  }
}
