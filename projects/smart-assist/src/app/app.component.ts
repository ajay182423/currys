import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ChangeDetectorRef, OnChanges, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/Router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { environment } from '../environments/environment';
import { IUser } from 'common_modules/interfaces/user';
import { ModalPopupComponent } from 'common_modules/components/modal-popup/modal-popup.component';
import { ThemeService } from 'common_modules/services/theme.service';
import { INavbarOptions, NavbarService } from 'common_modules/services/navbar.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { HelperService } from 'common_modules/services/helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy, OnChanges  {

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;
  openConfirmation: boolean = false;
  popupSubscription: Subscription;
  navbarSubscription: Subscription;
  modalComponentRef: any;
  fileUrl: string = environment.fileUrl;
  navbarOptions: INavbarOptions;
  menuItems: any = [];


  constructor(
    private confirmDialogService: ConfirmDialogService,
    private accountService: AccountService,
    private modalPopupService: ModalPopupService,
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
    private navbarService: NavbarService,
    private helperService: HelperService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.checkLocalStorage();
    this.setDocumentTitle();
    this.setRouterSubscription();
    this.setSubscriptions();
    this.setNavbar();
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.popupSubscription !== undefined) this.popupSubscription.unsubscribe();
  }

  @HostListener('document:keyup.escape')
  onKeydownHandler() {
    if (this.modalComponentRef.instance.popupComponentRef.instance.modalForm?.dirty) {
      Promise.resolve().then(async() => {
        if (await this.confirmDialogService.openConfirmDialog('Unsaved Changes', 'Are you sure you want to close without saving?','No', 'Yes')) {
          this.modalPopupService.closeOrGoToPreviousModalPopup();
        }
      });
    }
    else
      this.modalPopupService.closeOrGoToPreviousModalPopup();
  }

  checkLocalStorage() {
    //Check for dark mode
    let darkMode: boolean = JSON.parse(localStorage.getItem('darkMode'));
    if (darkMode) {
      this.themeService.setDarkMode(true);
    } else {
      this.themeService.setDarkMode(false);
    }
    //Check for navbarOptions
    let navbarOptions: INavbarOptions = JSON.parse(localStorage.getItem(environment.localStorageNavbarOptionsItem,));
    if (navbarOptions){
      this.navbarService.enableDisableExpandNavbarOnHover(environment.localStorageNavbarOptionsItem, navbarOptions?.expandOnHover);
      this.navbarService.enableDisableKeepNavbarExpanded(environment.localStorageNavbarOptionsItem, navbarOptions?.keepItExpanded);
    }
    //check for logged in platform user
    const user: IUser = JSON.parse(localStorage.getItem(environment.localStorageUserItem));
    if (user) {
      this.accountService.setCurrentUser(user);
    }
  }

  setDocumentTitle(){
    this.router.events.pipe(filter(event => event instanceof NavigationEnd),map(() => {
      const child = this.activatedRoute.firstChild;
      if (child.snapshot.data['title']) {
        return child.snapshot.data['title'] + ' - ' + environment.appName.part1 + ' ' + environment.appName.part2;
      } else {
        return environment.appName.part1 + ' ' + environment.appName.part2;
      }
    })).subscribe((title: string) => {
      this.titleService.setTitle(title);
    });
  }

  setRouterSubscription(){
    this.router.events.subscribe((event) => {
			if(event instanceof NavigationStart){
				this.handleRouterNavigation();
			}
		});
  }

  setSubscriptions(){
    this.popupSubscription = this.modalPopupService.modalPopup.subscribe(modalPopupObj => {
      if(modalPopupObj){
        if(modalPopupObj.openPopup){
          this.createModalPopup(modalPopupObj);
          this.changeDetectorRef.detectChanges();
        }
        else {
          if(this.modalComponentRef) {
            this.modalComponentRef.destroy();
          }
        }
      }
    });
    this.navbarSubscription = this.navbarService.navbarOptions.subscribe(data => {
      this.navbarOptions = data;
      this.changeDetectorRef.detectChanges();
    });
  }

  setNavbar(){
    this.helperService.getJSON(environment.jsonFilesUrl + 'navbar.json').subscribe(data => this.menuItems = data.menuItems);
  }

  createModalPopup(modalPopupObj:any) {
    this.modalContainer.clear();
    const factory = this.resolver.resolveComponentFactory(ModalPopupComponent);
    this.modalComponentRef = this.modalContainer.createComponent(factory);
    this.modalComponentRef.instance.modalPopupObj = modalPopupObj;
  }

  handleRouterNavigation() : void {
		if(this.modalPopupService.isModalPopupOpened()) {
      this.modalPopupService.closeOrGoToPreviousModalPopup();
    }
  }

}

