import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { IAppUser, IAppUsers, IAppUserUpdate } from 'projects/smart-assist/src/app/interfaces/settings/app-user';
import { getPaginatedResult, getPaginationHeaders } from 'common_modules/helpers/paginationHelper';
import { IMultiSelectDropDown } from 'common_modules/interfaces/multi-select-drop-down';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  baseUrl = environment.apiUrl + 'user/';

  constructor(private http: HttpClient) { }

  public isUpdating$ = new BehaviorSubject(null);

  public refreshNeeded$ = new BehaviorSubject(null);

  public getRecord(userName: string): Observable<IAppUser>{
    return this.http.get<IAppUser>(this.baseUrl + userName);
  }

  public getRecords(page?: number, itemsPerPage?: number) {
    let params = getPaginationHeaders(page, itemsPerPage);
    return getPaginatedResult<IAppUsers[]>(this.baseUrl, params, this.http).pipe(
      tap(response => { this.isUpdating$.next(''); return response; }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public create(obj: IAppUser) {
    this.isUpdating$.next('Adding');
    return this.http.post(this.baseUrl, obj).pipe(
      tap(() => { this.isUpdating$.next('Added successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public update(obj: IAppUserUpdate) {
    this.isUpdating$.next('Saving');
    return this.http.put(this.baseUrl, obj).pipe(
      tap(() => { this.isUpdating$.next('Saved successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public delete(userName: string) {
    this.isUpdating$.next('Deleting');
    return this.http.delete(this.baseUrl + userName).pipe(
      tap(() => { this.isUpdating$.next('Deleted successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public getRoleNamesForUserSetup(): Observable<IMultiSelectDropDown[]>{
    return this.http.get<IMultiSelectDropDown[]>(this.baseUrl + 'role-names');
  }
  public getListOfAllUsers(){
    return this.http.get(this.baseUrl+ 'list')
  }

}
