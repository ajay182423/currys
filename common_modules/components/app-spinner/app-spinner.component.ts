import { Component, Input, OnInit } from '@angular/core';
import { slideUp } from 'common_modules/animations/page-animation';

@Component({
  selector: 'app-spinner',
  templateUrl: './app-spinner.component.html',
  styleUrls: ['./app-spinner.component.scss'],
  animations: [slideUp]
})
export class AppSpinnerComponent implements OnInit{

  @Input() options: any;
  
  constructor(){ }

  ngOnInit(): void {
  }
}
