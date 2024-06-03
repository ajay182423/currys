import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { getPaginatedResult, getPaginationHeaders } from 'common_modules/helpers/paginationHelper';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { IAppRole, IAppRoleSpecialAccess } from '../../interfaces/settings/app-role';

@Injectable({
  providedIn: 'root'
})
export class AppRoleService {

  baseUrl = environment.apiUrl + 'role/';

  constructor(private http: HttpClient) { }

  public isUpdating$ = new BehaviorSubject(null);

  public refreshNeeded$ = new BehaviorSubject(null);

  public getRecord(id: number): Observable<IAppRole>{
    return this.http.get<IAppRole>(this.baseUrl + id);
  }

  public getRecords(page?: number, itemsPerPage?: number) {
    let params = getPaginationHeaders(page, itemsPerPage);
    return getPaginatedResult<IAppRole[]>(this.baseUrl, params, this.http).pipe(
      tap(response => { this.isUpdating$.next(''); return response; }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public create(obj: IAppRole) {
    this.isUpdating$.next('Adding');
    return this.http.post(this.baseUrl, obj).pipe(
      tap(() => { this.isUpdating$.next('Added successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public update(obj: IAppRole) {
    this.isUpdating$.next('Saving');
    return this.http.put(this.baseUrl, obj).pipe(
      tap(() => { this.isUpdating$.next('Saved successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public delete(id: number) {
    this.isUpdating$.next('Deleting');
    return this.http.delete(this.baseUrl + id).pipe(
      tap(() => { this.isUpdating$.next('Deleted successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public isNameUnique(name: string): Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl + 'is-unique/' + name);
  }

  public getSpecialAccessesForRoleSetup(roleId: number): Observable<IAppRoleSpecialAccess[]>{
    return this.http.get<IAppRoleSpecialAccess[]>(this.baseUrl + 'accesses/' + roleId);
  }

}
