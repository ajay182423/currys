import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-text',
  templateUrl: './help-text.component.html',
  styles: []
})
export class HelpTextComponent implements OnInit {

  data : any = [];
  @Input() modalPopupObj: any;
  constructor() { }

  ngOnInit(): void {
    this.data = (this.modalPopupObj.recordId).split('\\n');
    console.log(this.data);
  }

}
