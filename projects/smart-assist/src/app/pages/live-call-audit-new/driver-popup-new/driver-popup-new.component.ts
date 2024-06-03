import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-popup-new',
  templateUrl: './driver-popup-new.component.html',
  styleUrls: ['./driver-popup-new.component.scss']
})
export class DriverPopupNewComponent implements OnInit {

  public type1: string = 'directive';

  constructor() { }
  @Input() modalPopupObj: any;

  ngOnInit(): void {
      console.log(this.modalPopupObj);
  }
  public onScrollEvent(event: any): void {
    // console.log(event);
  }

}
