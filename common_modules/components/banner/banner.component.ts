import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {

  @Input() bannerData: any;
  @Output() bannerClickEvent = new EventEmitter<any>();
  
  constructor(){ }
  
  sendBannerClickEvent(){
    this.bannerClickEvent.emit();
  }
}
