import { Injectable } from '@angular/core';
import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { IUser } from 'common_modules/interfaces/user';
import { AccountService } from '../services/account.service';
import { HelperService } from 'common_modules/services/helper.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  constructor(
    private accountService: AccountService,
    private helperService: HelperService,
    private cookieService: CookieService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //if calling refresh token api then return
    if (request.url.indexOf('/refresh-token') > -1) {
      return next.handle(request);
    }

    if (this.isRefreshing) {
      return EMPTY;
    }

    //get current user
    let currentUser: IUser;
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
    if (currentUser) {
      //get access token expiration result. if access token is not expired then add auth header and return
      const isExpired = this.helperService.isTokenExpired(currentUser.token);
      if (!isExpired) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`,
          }
        });
        return next.handle(request);
      }
      //if access token has expired
      //to access from cookie [temporary not using cookie] > this.cookieService.get("SMAT_refreshToken")
      this.isRefreshing = true;
      const payload = {
        token: currentUser.token,
        refreshToken: currentUser.refreshToken,
      };
      return this.accountService.getNewAccessTokenUsingRefreshToken(payload).pipe(
        switchMap((refreshedUserObj: IUser) => {
          this.isRefreshing = false;
          this.accountService.setCurrentUser(refreshedUserObj);
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${refreshedUserObj.token}`,
            }
          });
          return next.handle(request);
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
