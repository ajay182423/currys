import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-help-text',
  templateUrl: './help-text.component.html',
  styles: []
})
export class HelpTextComponent implements OnInit {

  constructor(

  ) { }

  @Input() modalPopupObj: any;

  ngOnInit(): void {
  }

}
