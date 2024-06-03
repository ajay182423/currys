import { Component, OnInit } from '@angular/core';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { slideUp } from 'common_modules/animations/page-animation';
import { Router } from '@angular/router';
import { HelperService } from 'common_modules/services/helper.service';

@Component({
  selector: 'help-landing-page',
  templateUrl: './help-landing-page.component.html',
  styleUrls: ['./help-landing-page.component.scss'],
  animations: [slideUp]
})
export class HelpLandingPageComponent implements OnInit {

  fileUrl: string = environment.fileUrl;
  noContentOptions: any;
  isLoading: boolean = false;
  helpTopics: any = [];

  constructor(
    private router: Router,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.helperService.getJSON(environment.jsonFilesUrl + 'help-landing-page.json').subscribe(data => {
      if (data){
        this.helpTopics = data.helpTopics;
      } else {
        this.helpTopics = [];
        this.noContentOptions = {
          img: environment.fileUrl + 'assets/no-content.svg',
          message: 'No help records found'
        }
      }
      this.isLoading = false;
    });
  }

  openHelpDoc(recordId: number){
    this.router.navigateByUrl('/help/doc/' + recordId);
  }
}
