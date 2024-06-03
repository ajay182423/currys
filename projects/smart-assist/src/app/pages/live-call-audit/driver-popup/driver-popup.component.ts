import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-popup',
  templateUrl: './driver-popup.component.html',
  styleUrls: ['./driver-popup.component.scss']
})
export class DriverPopupComponent implements OnInit {

  public type1: string = 'directive';

  constructor() { }
  @Input() modalPopupObj: any;

  ngOnInit(): void {
  }
  public onScrollEvent(event: any): void {
    // console.log(event);
  }

}
