import { Component, OnInit, HostListener } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ModalPopupService } from '../../services/modal-popup.service__';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-new',
  templateUrl: './navbar-new.component.html',
  styles: [
  ]
})
export class NavbarNewComponent implements OnInit {

  userFirstName: string;
  isNotificationOpened: boolean = false;
  isUserMenuOpened: boolean = false;
  isItFirstTime: boolean = false;
  constructor(private accountService: AccountService,
    private modalPopupService: ModalPopupService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.userFirstName = user.firstName;
      }
    });
  }

  logout() {
    //close notification popup if opened
    if (this.isNotificationOpened) {
      this.modalPopupService.closeModalPopup();
    }
    //now logout
    this.accountService.logoutFromServer().subscribe(response => {
      this.accountService.logout();
    });
  }



  openUserMenu(e: MouseEvent) {
    this.isItFirstTime = true;
    if (this.isUserMenuOpened) {
      this.isUserMenuOpened = false;
    }
    else {
      this.isUserMenuOpened = true;
    }
  }

  @HostListener('document:click')
  public onDocumentClick() {
    if (this.isUserMenuOpened && !this.isItFirstTime) {
      this.isUserMenuOpened = false;
    }
    else {
      this.isItFirstTime = false;
    }
  }

}
