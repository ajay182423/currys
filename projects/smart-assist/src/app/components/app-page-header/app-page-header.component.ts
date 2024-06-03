import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { slideDown } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { ThemeService } from 'common_modules/services/theme.service';
import { NavbarService } from 'common_modules/services/navbar.service';
import { AccountService } from '../../services/account.service';
import { take } from 'rxjs/operators';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { AppUserAccountComponent } from '../app-user-account/app-user-account.component';
import { MobileHiddenNavbarComponent } from 'common_modules/components/mobile-hidden-navbar/mobile-hidden-navbar.component';

@Component({
  selector: 'app-page-header',
  templateUrl: './app-page-header.component.html',
  styleUrls: ['./app-page-header.component.scss'],
  animations: [slideDown]
})
export class AppPageHeaderComponent implements OnInit {

  fileUrl: string = environment.fileUrl;
  isDarkMode: boolean = false;
  userFullName: string;
  roleName: string;
  @Input() menuItems: any;
  appName1: string = environment.appName.part1;
  appName2: string = environment.appName.part2;
  @Input() title: string;
  @Input() subTitle?: string;
  @Input() goBack?: boolean = false;
  @Input() showSeparator?: boolean = false;
  @Input() showUserAccount?: boolean = true;
  @Input() showSaveButton?: boolean = false;
  @Input() createNew?: boolean = false;
  @Input() createMenuItems?: any = [];
  @Input() bgColor?: string = '#490E9F';
  @Output() createNewEvent = new EventEmitter<any>();
  @Output() saveButtonEvent = new EventEmitter<any>();

  constructor(
    public navbarService: NavbarService,
    private router: Router,
    private location: Location,
    private themeService: ThemeService,
    private accountService: AccountService,
    private modalPopupService: ModalPopupService,
  ){ }

  ngOnInit(): void {
    //theme
    this.themeService.darkMode.subscribe(data => {
      this.isDarkMode = data;
    });
    //populate user info
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.userFullName = user.firstName + ' ' + user.lastName;
        this.roleName = user.roleName;
      }
    });
  }

  toggleDarkMode() {
    this.themeService.setDarkMode(!this.isDarkMode);
    if (this.router.url.includes('dashboard')){
      window.location.reload();
    }
  }

  goBackToPrePage() {
    if (this.router.url.includes('settings')){
      this.router.navigateByUrl('/settings');
    } else {
      this.location.back();
    }
  }

  closeDesigner(){
    this.location.back();
    this.navbarService.showHideNavbar(true);
  }

  sendCreateNewRequest(){
    this.createNewEvent.emit();
  }

  sendSaveButtonRequest(){
    this.saveButtonEvent.emit();
  }

  openUserAccountPopup() {
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

  //#region - Popup create menu
  showCreateMenu: boolean = false;

  openCreateMenu(e){
    this.showCreateMenu = true;
    e.stopPropagation();
  }

  @HostListener('window:blur')
  @HostListener('document:click')
  public onDocumentClick(e) {
    if (this.showCreateMenu) {
      this.showCreateMenu = false;
    }
  }

  onPopupMenuClick($event) {
    this.showCreateMenu = false;
    this.createNewEvent.emit($event.name);
  }
  //#endregion

  signOut() {
    this.accountService.logout().subscribe(response => {
      this.accountService.logoutFromBrowser();
    });
  }
 
  setLightMode() {
    this.themeService.setDarkMode(false);
  }
 
  setDarkMode() {
    this.themeService.setDarkMode(true);
  }

  getShortName(userFullName) {
    if(userFullName != null)
      {
        return userFullName.split(' ').map(n => n[0]).join('');
      }    
  }
}
