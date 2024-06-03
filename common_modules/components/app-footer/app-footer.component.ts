import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
  providers: [DatePipe]
})
export class AppFooterComponent {

  currentYear;

  constructor(private datePipe: DatePipe){
    let currentDate = new Date();
    this.currentYear = this.datePipe.transform(currentDate, 'yyyy');
  }

}
