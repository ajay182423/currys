import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class CanAccessPageGuard implements CanActivate {

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const currentUser = this.accountService.getCurrentUserValue();
    if (currentUser) {
      if (currentUser.userRole.includes(route.data.id)) {
        return true;
      }
    }
    this.router.navigateByUrl('/error/404');
    return false;
  }

}
