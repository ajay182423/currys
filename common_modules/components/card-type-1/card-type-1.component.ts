import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'card-type-1',
  templateUrl: './card-type-1.component.html',
  styleUrls: ['./card-type-1.component.scss']
})
export class CardType1Component {

  @Input() cardData: any;
  @Output() cardType1ClickEvent = new EventEmitter<any>();
  
  constructor(){ }
  
  sendCardType1ClickEvent(returnValue: any){
    this.cardType1ClickEvent.emit(returnValue);
  }
}
