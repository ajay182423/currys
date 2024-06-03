import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/Router';
import { NavbarService } from 'common_modules/services/navbar.service';
import { ThemeService } from 'common_modules/services/theme.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { take } from 'rxjs/operators';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './app-user-account.component.html',
})
export class AppUserAccountComponent implements OnInit {

  @Input() modalPopupObj: any;
  userFullName: string;
  roleName: string;
  isLoading: boolean = false;
  isDarkMode: boolean = false;
  showNavSettings: boolean = false;
  keepNavbarExpanded: boolean = false;
  expandNavbarOnHover: boolean = true;
  isLiveToggle:boolean ;

  constructor(
    private accountService: AccountService,
    private themeService: ThemeService,
    private navbarService: NavbarService,
    private router: Router,
  ) { }

  //Custom initialization
  ngOnInit(): void {
    this.isLiveToggle = JSON.parse(localStorage.getItem('issmart-assistLiveToggle'))
    //theme
    this.themeService.darkMode.subscribe(data => {
      this.isDarkMode = data;
    });
    //Navbar
    this.navbarService.navbarOptions.subscribe(data => {
      this.keepNavbarExpanded = data.keepItExpanded;
      this.expandNavbarOnHover = data.expandOnHover;
    });
    //Navbar
    this.navbarService.navbarOptions.subscribe(data => {
      this.keepNavbarExpanded = data.keepItExpanded;
      this.expandNavbarOnHover = data.expandOnHover;
    });
    //populate user info
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.userFullName = user.firstName + ' ' + user.lastName;
        this.roleName = user.roleName;
      }
    });
  }

  logout() {
    this.isLoading = true;
    this.accountService.logout().subscribe(response => {
      this.accountService.logoutFromBrowser();
      this.isLoading = false;
    });
  }

  toggleDarkMode() {
    this.themeService.setDarkMode(!this.isDarkMode);
    if (this.router.url.includes('dashboard')){
      window.location.reload();
    }
  }
  toggleLivePage(){
    localStorage.setItem('issmart-assistLiveToggle', String(this.isLiveToggle))
  }

  toggleKeepNavbarExpanded() {
    this.navbarService.enableDisableKeepNavbarExpanded(environment.localStorageNavbarOptionsItem, !this.keepNavbarExpanded);
  }

  toggleExpandNavbarOnHover() {
    this.navbarService.enableDisableExpandNavbarOnHover(environment.localStorageNavbarOptionsItem, !this.expandNavbarOnHover);
  }

}
