import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private toastrService: ToastrService,
    private router: Router,
  ) {}

  canActivate() {
    const currentUser = this.accountService.getCurrentUserValue();
    if (currentUser) {
      return true;
    } 
    this.router.navigateByUrl('/login');
    this.toastrService.error('Please login to access content');
    return false;
  }
  
}
