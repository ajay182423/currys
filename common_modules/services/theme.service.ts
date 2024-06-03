import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkModeStatus: boolean = false;
  private darkModeSource = new BehaviorSubject(null);
  darkMode = this.darkModeSource.asObservable();

  constructor() { }

  setDarkMode(isModeDark: boolean) {
    
    this.darkModeSource.next(isModeDark);
    this.darkModeStatus = isModeDark;

    let body = document.getElementsByTagName('body')[0];
    if (isModeDark === true) {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      localStorage.setItem('darkMode', 'true');
    }
    else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      localStorage.setItem('darkMode', 'false');
    }
  }

  setLightMode() {
    
    //this is only required for explorer/microsite as 
    //we are not trying dark mode in explorer/microsite app
    this.darkModeSource.next(false);
    this.darkModeStatus = false;

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
  
  }

  getDarkModeStatus(): boolean{
    return this.darkModeStatus;
  }

}