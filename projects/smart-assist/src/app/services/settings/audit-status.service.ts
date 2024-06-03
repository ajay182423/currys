import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from 'common_modules/helpers/paginationHelper';
import { IAuditStatus } from '../../interfaces/settings/audit-status';

@Injectable({
  providedIn: 'root'
})
export class AuditStatusService {

  baseUrl = environment.apiUrl + 'AuditStatus/';

  constructor(private http: HttpClient) { }

  public isUpdating$ = new BehaviorSubject(null);

  public refreshNeeded$ = new BehaviorSubject(null);

  public getRecord(id: number): Observable<IAuditStatus>{
    return this.http.get<IAuditStatus>(this.baseUrl + id);
  }

  public getRecords(page?: number, itemsPerPage?: number) {
    let params = getPaginationHeaders(page, itemsPerPage);
    return getPaginatedResult<IAuditStatus[]>(this.baseUrl, params, this.http).pipe(
      tap(response => { this.isUpdating$.next(''); return response; }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public create(obj: IAuditStatus) {
    this.isUpdating$.next('Adding');
    return this.http.post(this.baseUrl, obj).pipe(
      tap(() => { this.isUpdating$.next('Added successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public update(obj: IAuditStatus) {
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

  public resultList():Observable<any>{
    return this.http.get(this.baseUrl+ 'list')
  }
}
