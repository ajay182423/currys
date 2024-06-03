import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private loggedOut: boolean = false;
  
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error?.error?.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              } else if (typeof(error.error) === 'object') {
                this.toastr.error(error.statusText);
              } else {
                this.toastr.error(error.error);
              }
              break;
            case 401:
              if (error?.error?.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              } else if (typeof(error.error) === 'object') {
                this.toastr.error(error.statusText);
              } else {
                if (error.error === "Access token expired" && this.loggedOut === false){
                  this.loggedOut = true;
                  alert("You have been logged out. Please login again");
                  this.accountService.logoutFromBrowser();
                } else {
                  this.toastr.error(error.error);
                }
              }
              break;
            case 404:
              this.router.navigateByUrl('/error/404');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}}
              this.router.navigateByUrl('/error/500', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              break;
          }
        }
        return throwError(error);
      })
    )
  }
}
