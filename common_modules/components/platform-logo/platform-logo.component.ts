import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'platform-logo',
  templateUrl: './platform-logo.component.html',
  styleUrls: ['./platform-logo.component.scss']
})
export class PlatformLogoComponent implements OnInit {

  @Input() logoImgUrl: string;
  @Input() appName: any;
  
  constructor() {}

  ngOnInit(): void {
  }

}
