import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-layouts',
  templateUrl: './app-layouts.component.html',
  styleUrls: ['./app-layouts.component.scss']
})
export class AppLayoutsComponent implements OnInit {

  public isMenu: boolean =false
  constructor() { }

  ngOnInit(): void {
  }
  toggleMenuAction(menu: boolean) {
    this.isMenu = menu
  }

}
