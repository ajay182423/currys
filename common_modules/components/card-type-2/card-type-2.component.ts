import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'card-type-2',
  templateUrl: './card-type-2.component.html',
  styleUrls: ['./card-type-2.component.scss']
})
export class CardType2Component {

  @Input() cardData: any;
  @Output() cardType2ClickEvent = new EventEmitter<any>();
  
  constructor(){ }
  
  sendCardType2ClickEvent(returnValue: any){
    this.cardType2ClickEvent.emit(returnValue);
  }

  showMoreOrLessPappCards(func: any){
    if(func.pappCardShowCount === 4){
      func.pappCardShowCount = func.pappCardList.length;
    }
    else{
      func.pappCardShowCount = 4;
    }
  }
}
