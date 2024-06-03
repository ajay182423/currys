import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { IUser } from 'common_modules/interfaces/user';
import { IDropDown } from 'common_modules/interfaces/drop-down';
import { HelperService } from 'common_modules/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl + 'account/';

  private currentUserSource = new BehaviorSubject(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
  ) { }

  //user-account
  login(model: any) {
    localStorage.removeItem(environment.localStorageUserItem);
    this.currentUserSource.next(null);
    return this.http.post<IUser>(this.baseUrl + 'login', model);
  }

    //54 is coz of the ID at Platform DB end for this app
    public logoutFromServer(): Observable<boolean>{
      let pappId:number=0;
      const user: IUser = JSON.parse(localStorage.getItem('smartemail_user'));
      if (user) {
        pappId=user.pappId;
      }
      return this.http.put<boolean>(this.baseUrl + 'Account/logout/'+ pappId, null);
    }


  public getNewAccessTokenUsingRefreshToken(model: any) {
    return this.http.post<IUser>(this.baseUrl + 'refresh-token', model);
  }

  public getCurrentUserValue(): IUser {
    return this.currentUserSource.value;
  }

  public setCurrentUser(user: IUser) {
    user.userRole = this.helperService.getDecodedToken(user.token).role;
    localStorage.setItem(environment.localStorageUserItem, JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public logoutFromBrowser(){
    localStorage.removeItem(environment.localStorageUserItem);
    this.currentUserSource.next(null);
    window.close();
    window.location.href= environment.platformUrl;
  }

  public logout(): Observable<boolean>{
    return this.http.put<boolean>(this.baseUrl + 'logout', null);
  }

  //Other Account functions
  public getUserGroupNamesForSetup(): Observable<IDropDown[]>{
    return this.http.get<IDropDown[]>(this.baseUrl + 'user-groups');
  }

}
