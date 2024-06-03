import { Component, Input, OnInit } from '@angular/core';
import { slideUp } from 'common_modules/animations/page-animation';

@Component({
  selector: 'app-reference-popup',
  templateUrl: './reference-popup.component.html',
  styleUrls: ['./reference-popup.component.scss'],
  animations: [slideUp],
  styles: []
})
export class ReferencePopupComponent implements OnInit {

  @Input() modalPopupObj: any;
  htmlObj : any

  constructor( ) { }

  ngOnInit(): void {
    document.getElementById("responseText").innerHTML = this.modalPopupObj.recordId;

    var allElementLink = document.querySelectorAll('a');

    for (var i = 0; i < allElementLink.length; i++) {
      allElementLink[i].addEventListener('click', function(event) {
        event.preventDefault();
        let get_id = this.getAttribute('href').slice(1)
        console.log(get_id)
        document.getElementById(get_id).scrollIntoView();
      });
    }
  }

  scrollToTop() {
      document.getElementById('top').scrollIntoView();
  }




}
