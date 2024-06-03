import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface INavbarOptions {
  isVisible: boolean,
  keepItExpanded: boolean,
  expandOnHover: boolean
}

@Injectable()
export class NavbarService {

  private navbarOptionsSource = new BehaviorSubject<INavbarOptions>({
    isVisible: true,
    keepItExpanded: true,
    expandOnHover: false
  });
  navbarOptions = this.navbarOptionsSource.asObservable();
  
  constructor() { }

  getIsNavbarVisibleStatus(): boolean {
    return this.navbarOptionsSource.value.isVisible;
  }
  getKeepNavbarExpandedStatus(): boolean {
    return this.navbarOptionsSource.value.keepItExpanded;
  }
  getExpandNavbarOnHoverStatus(): boolean {
    return this.navbarOptionsSource.value.expandOnHover;
  }
  showHideNavbar(value: boolean) {
    let newOptions: INavbarOptions = {
      isVisible: value,
      keepItExpanded: this.navbarOptionsSource.value.keepItExpanded,
      expandOnHover: this.navbarOptionsSource.value.expandOnHover
    };
    this.navbarOptionsSource.next(newOptions);
  }
  enableDisableKeepNavbarExpanded(navbarOptionsObjName: string,value: boolean) {
    let newOptions: INavbarOptions = {
      isVisible: this.navbarOptionsSource.value.isVisible,
      keepItExpanded: value,
      expandOnHover: this.navbarOptionsSource.value.expandOnHover
    };
    this.navbarOptionsSource.next(newOptions);
    this.setNavbarOptionsInLocalStorage(navbarOptionsObjName, newOptions);
  }
  enableDisableExpandNavbarOnHover(navbarOptionsObjName: string, value: boolean) {
    let newOptions: INavbarOptions = {
      isVisible: this.navbarOptionsSource.value.isVisible,
      keepItExpanded: this.navbarOptionsSource.value.keepItExpanded,
      expandOnHover: value
    };
    this.navbarOptionsSource.next(newOptions);
    this.setNavbarOptionsInLocalStorage(navbarOptionsObjName, newOptions);
  }

  setNavbarOptionsInLocalStorage(navbarOptionsObjName:string, options: INavbarOptions){
    localStorage.setItem(navbarOptionsObjName, JSON.stringify(options));
  }
}
