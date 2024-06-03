import { Component, OnInit } from '@angular/core';
import { HelperService } from 'common_modules/services/helper.service';
import { environment } from 'projects/smart-assist/src/environments/environment';

@Component({
  selector: 'settings-links-page',
  templateUrl: './settings-links-page.component.html',
})
export class SettingsLinksPageComponent implements OnInit {

  fileUrl: string = environment.fileUrl;
  localStorageUserItem: string = environment.localStorageUserItem;
  noContentOptions: any;
  isLoading: boolean = false;
  settingsMenu: any = []

  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.helperService.getJSON(environment.jsonFilesUrl + 'settings-links.json').subscribe(data => {
      if (data){
        this.settingsMenu = data.settingsMenu;
      } else {
        this.noContentOptions = {
          img: environment.fileUrl + 'assets/no-content.svg',
          message: 'Sorry! you do not have access to any setting'
        }
      }
      this.isLoading = false;
    });
  }

}
