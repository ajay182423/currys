import { Component, Input, OnInit } from '@angular/core';
import { MobileHiddenNavbarComponent } from 'common_modules/components/mobile-hidden-navbar/mobile-hidden-navbar.component';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { AppUserAccountComponent } from '../app-user-account/app-user-account.component';

@Component({
  selector: 'app-left-navbar',
  templateUrl: './app-left-navbar.component.html',
  styleUrls: ['./app-left-navbar.component.scss'],
})
export class AppLeftNavbarComponent implements OnInit {

  @Input() menuItems: any;
  @Input() keepNavbarExpanded?: boolean = false;
  @Input() expandOnHover?: boolean = true;
  @Input() navbar_icon?: boolean = false;

  fileUrl: string = environment.fileUrl;
  appName1: string = environment.appName.part1;
  appName2: string = environment.appName.part2;

  constructor(
    private modalPopupService: ModalPopupService,
  ) { }

  ngOnInit(): void {
  }

  openUserAccountInMobile() {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      popupPosition: 'right',
      heading: 'Account',
      width: '38rem',
      popup: AppUserAccountComponent
    });
  }

  openMobileHiddenMenu() {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      popupPosition: 'left',
      heading: 'Menu',
      width: '25rem',
      menuItems: this.menuItems,
      popup: MobileHiddenNavbarComponent
    });
  }
}
