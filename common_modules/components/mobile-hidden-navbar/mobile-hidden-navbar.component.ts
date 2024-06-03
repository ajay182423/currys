import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from 'common_modules/services/theme.service';

@Component({
  selector: 'mobile-hidden-navbar',
  templateUrl: './mobile-hidden-navbar.component.html',
  styleUrls: ['./mobile-hidden-navbar.component.scss']
})
export class MobileHiddenNavbarComponent implements OnInit {

  @Input() modalPopupObj: any;

  constructor() { }
  
  //Custom initialization
  ngOnInit(): void {
  }
}
