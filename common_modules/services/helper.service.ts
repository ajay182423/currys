import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private currentDataSource = new BehaviorSubject(null);
  currentData$ = this.currentDataSource.asObservable();


  constructor(private httpClient: HttpClient) { }

  //helper
  public callRestAPI(method: string, endPoint:string, obj?: any): any {
    switch(method){
      case 'get':
        return this.httpClient.get<any>(endPoint);
      case 'post':
        return this.httpClient.post(endPoint, obj);
      case 'put':
        return this.httpClient.put(endPoint, obj);
      case 'delete':
        return this.httpClient.delete(endPoint);
    }
  }

  public getJSON(filePath): any {
    return this.httpClient.get(filePath);
  }
  public clearFormData() {
    this.currentDataSource.next(null)
  }

  public getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  public isTokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public getNowUTC() {
    const now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  }

  public setFormData(data, index) {
      this.currentDataSource.next({data:data, index:index})
  }

}
