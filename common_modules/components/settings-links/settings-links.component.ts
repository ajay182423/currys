import { Component, Input, OnInit } from '@angular/core';
import { IUser } from 'common_modules/interfaces/user';

@Component({
  selector: 'settings-links',
  templateUrl: './settings-links.component.html',
  styleUrls: ['./settings-links.component.scss'],
})
export class SettingsLinksComponent implements OnInit {

  @Input() localStorageUserItem: string;
  @Input() settingsMenu: any;
  user: IUser;
  
  constructor() { }

  ngOnInit(): void {
    const user: IUser = JSON.parse(localStorage.getItem(this.localStorageUserItem));
    if (user) {
      this.user = user;
    }
  }

  hasAccessToCategory(list): boolean {
    //extract settings page ids from list
    let pageIds = [];
    list.forEach(element => {
      pageIds.push(element.id);
    });
    let hasAccess: boolean = false;
    pageIds.forEach(element => {
      if (this.user.userRole.includes(element)) {
        hasAccess = true;
      }
    });
    return hasAccess;
  }

}
