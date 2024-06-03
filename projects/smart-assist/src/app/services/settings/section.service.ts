import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { getPaginatedResult, getPaginationHeaders } from 'common_modules/helpers/paginationHelper';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { ISection } from '../../interfaces/settings/section';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  baseUrl = environment.apiUrl + 'sections/';

  constructor(private http: HttpClient) { }

  public isUpdating$ = new BehaviorSubject(null);

  public refreshNeeded$ = new BehaviorSubject(null);

  public getRecord(id: number): Observable<ISection>{
    return this.http.get<ISection>(this.baseUrl + id);
  }
  public getRecords(page?: number, itemsPerPage?: number) {
    let params = getPaginationHeaders(page, itemsPerPage);
    return getPaginatedResult<ISection[]>(this.baseUrl, params, this.http).pipe(
      tap(response => { this.isUpdating$.next(''); return response; }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public create(obj: ISection) {
    this.isUpdating$.next('Adding');
    return this.http.post(this.baseUrl, obj).pipe(
      tap(() => { this.isUpdating$.next('Added successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

  public update(obj: ISection) {
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

  public GetListofAllSection(): Observable<any>{
    return this.http.get<any>(this.baseUrl+ 'list');
  }
  public GetAllSection(): Observable<any>{
    return this.http.get<any>(this.baseUrl+ 'all-records');
  }
}
