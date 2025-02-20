import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './app-logo.component.html',
  styleUrls: ['./app-logo.component.scss']
})
export class AppLogoComponent implements OnInit {

  @Input() logoImgUrl: string;
  @Input() appName: string;
  
  constructor() {}

  ngOnInit(): void {
  }

}
