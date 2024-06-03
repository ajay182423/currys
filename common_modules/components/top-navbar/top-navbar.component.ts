import { Component, Input, OnInit } from '@angular/core';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { ThemeService } from 'common_modules/services/theme.service';
import { MobileHiddenNavbarComponent } from '../mobile-hidden-navbar/mobile-hidden-navbar.component';

@Component({
  selector: 'top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {

  @Input() menuItems: any;
  @Input() loginUrl?: string;
  @Input() darkModeOption?: boolean = false;
  isDarkMode: boolean = false;

  constructor(
    private modalPopupService: ModalPopupService,
    private themeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.themeService.darkMode.subscribe(data => {
      this.isDarkMode = data;
    });
  }

  openMobileHiddenMenu() {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      popupPosition: 'left',
      heading: 'Menu',
      width: '25rem',
      menuItems: this.menuItems,
      darkModeOption: this.darkModeOption,
      popup: MobileHiddenNavbarComponent
    });
  }

  toggleDarkMode() {
    this.themeService.setDarkMode(!this.isDarkMode);
  }
}
