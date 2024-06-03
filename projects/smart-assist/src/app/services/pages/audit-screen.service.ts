import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { IAuditSceeen } from '../../interfaces/pages/audit-screen';


@Injectable({
  providedIn: 'root'
})
export class AuditScreenService {

  baseUrl = environment.apiUrl + 'auditedform/';

  constructor(private http: HttpClient) { }


}
