import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/Router';
import { slideUp } from 'common_modules/animations/page-animation';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
  animations: [slideUp]
})
export class ErrorPageComponent implements OnInit {

  errorData: any;

  constructor(private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    //search
    this.route.params.subscribe(params => {
      if (+params['code'] === 500){
        this.errorData = {
          code: '500',
          title: 'Something went wrong',
          message: 'We are experiencing an internal server problem, please try back later.',
          buttonText: 'Go Back'
        }
      } else if (params['code'] === "000"){
        this.errorData = {
          code: '',
          title: 'You have been logged out!',
          message: 'Open it again from My Apps',
          buttonText: 'Go Back'
        }
      } else {
        this.errorData = {
          code: '404',
          title: 'Content not found',
          message: 'The content you are looking for was moved, removed, renamed or might never existed.',
          buttonText: 'Go Back'
        }
      }
    });
  }
  
}
