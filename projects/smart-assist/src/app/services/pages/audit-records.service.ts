import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { getAuditPaginationHeaders, getPaginatedResult, getPaginationHeaders } from 'common_modules/helpers/paginationHelper';
import { IAuditRecords } from '../../interfaces/pages/audit-record';
import { IAgentScore, IbackOffice } from '../../interfaces/pages/agent-score';

@Injectable({
  providedIn: 'root'
})
export class AuditRecordsService {

  baseUrl = environment.apiUrl + 'auditrecord/';

  constructor(private http: HttpClient) { }

  public isUpdating$ = new BehaviorSubject(null);

  public refreshNeeded$ = new BehaviorSubject(null);

  public getRecord(id: any): Observable<IAuditRecords>{
    return this.http.get<IAuditRecords>(this.baseUrl + id);
  }
  public getRecordss(): Observable<IAgentScore>{
    return this.http.get<IAgentScore>(this.baseUrl);
  }

  public getRecords(page?: number, itemsPerPage?: number) {
    let params = getPaginationHeaders(page, itemsPerPage);
    return getPaginatedResult<IAgentScore[]>(this.baseUrl, params, this.http).pipe(
      tap(response => { this.isUpdating$.next(''); return response; }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }


  public getSearchedRecord(query:string, page?: number, itemsPerPage?: number ): Observable<any>{
    let params = getPaginationHeaders(page, itemsPerPage);
    return getPaginatedResult<IAgentScore[]>(this.baseUrl + 'search-record/' + query, params, this.http).pipe(
      tap(response => {
        this.isUpdating$.next('');
        return response;
     }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public getbackOfficeRecords() {
    return this.http.get<IbackOffice[]>(this.baseUrl + 'list');
  }

  public getRecordsForSetup() {
    return this.http.get<IAgentScore[]>(this.baseUrl + 'list');
  }

  public getRecordsByFilter(dateFrom?:Date, dateTo?:Date, page?: number, itemsPerPage?: number) {
    // let params = getPaginationHeaders(page, itemsPerPage);
    let auditRecordsParams = getAuditPaginationHeaders(dateFrom, dateTo, page, itemsPerPage);
    return getPaginatedResult<any[]>(this.baseUrl + 'filter-records', auditRecordsParams, this.http).pipe(
      tap(response => {
        this.isUpdating$.next('');
        return response;

     }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public flaggedCall(flag: any, transactionId: string){
    return this.http.patch(this.baseUrl+'flag/'+transactionId, flag)
  }
  public getCallDetails(transactionId:string):Observable<any>{
    return this.http.get(this.baseUrl+transactionId);
  }



}
