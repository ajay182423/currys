import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { getAuditPaginationHeaders, getPaginatedResult, getPaginationHeaders } from 'common_modules/helpers/paginationHelper';
import { IAuditParameterResult } from '../../interfaces/pages/audit-parameter-result';

@Injectable({
  providedIn: 'root'
})
export class AuditParameterResultService {

  baseUrl = environment.apiUrl + 'auditparameterresult/';

  constructor(private http: HttpClient) { }

  public isUpdating$ = new BehaviorSubject(null);

  public refreshNeeded$ = new BehaviorSubject(null);

  public getRecord(id: number): Observable<IAuditParameterResult>{
    return this.http.get<IAuditParameterResult>(this.baseUrl + id);
  }

  public getRecords(page?: number, itemsPerPage?: number) {
    let params = getPaginationHeaders(page, itemsPerPage);
    return getPaginatedResult<IAuditParameterResult[]>(this.baseUrl, params, this.http).pipe(
      tap(response => { this.isUpdating$.next(''); return response; }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public getSearchedRecord (columnName:string, query:string, page?: number, itemsPerPage?: number ): Observable<any>{
    console.log(columnName, query);
    let params = getPaginationHeaders(page, itemsPerPage);
    return getPaginatedResult<IAuditParameterResult[]>(this.baseUrl + 'search-record/' + columnName +'/' + query, params, this.http).pipe(
      tap(response => {
        this.isUpdating$.next('');
        return response;
     }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public getRecordsForSetup() {
    return this.http.get<IAuditParameterResult[]>(this.baseUrl + 'list');
  }

  public getRecordsByFilter(dateFrom?:Date, dateTo?:Date, page?: number, itemsPerPage?: number) {
    // let params = getPaginationHeaders(page, itemsPerPage);
    let auditRecordsParams = getAuditPaginationHeaders(dateFrom, dateTo, page, itemsPerPage);
    return getPaginatedResult<IAuditParameterResult[]>(this.baseUrl + 'filter-records', auditRecordsParams, this.http).pipe(
      tap(response => {
        this.isUpdating$.next('');
        return response;

     }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public getDayWiseParameters(): Observable<any>{
    return this.http.get<any>(this.baseUrl + 'get-day-wise-parameter');
  }
  public getMonthParameters(): Observable<any>{
    return this.http.get<any>(this.baseUrl + 'get-month-wise-parameter');
  }



}
