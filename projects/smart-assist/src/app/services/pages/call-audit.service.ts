import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { IAudioCallAudit, IPostCallAudit, IGetTranscript } from '../../interfaces/pages/call-audit';


@Injectable({
  providedIn: 'root'
})
export class CallAuditService {

  // baseUrl = environment.apiUrl + 'auditparameterform/';
  // audioUrl = 'https://finance-exleratortest1.exlservice.com/smart-assist-ml-api/get-audio/v1';
  // batchRunUrl = 'https://finance-exleratortest1.exlservice.com/smart-assist-ml-api/batch-run/v1';
  // transcriptUrl = 'https://finance-exleratortest1.exlservice.com/smart-assist-ml-api/get-transcript/v1';
  // // getTranscriptUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/smart-assist-ml-api/get-transcript/v1';
  // getTranscriptUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/smart-assist-ml-api/get-bg-transcript/v1';
  // transcriptMultiLangUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/smart-assist-ml-api/get-multi-transcript/v1';
  // kbUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/chatbotnew/ask_bot'

  baseUrl = environment.apiUrl + 'auditparameterform/';
  audioUrl = 'https://finance-exleratortest1.exlservice.com/smart-audit-ml-api/get-audio/v1';
  batchRunUrl = 'https://finance-exleratortest1.exlservice.com/smart-audit-ml-api/batch-run/v1';
  transcriptUrl = 'https://finance-exleratortest1.exlservice.com/smart-audit-ml-api/get-transcript/v1';
  // getTranscriptUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/smart-audit-ml-api/get-transcript/v1';
  // getTranscriptUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/smart-audit-ml-api/get-bg-transcript/v1';
  getTranscriptUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/sa-new-api/get-bg-transcript-new/v1';
  transcriptMultiLangUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/smart-audit-ml-api/get-multi-transcript/v1';
  kbUrl = 'https://finance-exleratortest1.exlservice.com/s4/app/chatbotnew/ask_bot'


  constructor(private http: HttpClient) { }

  public isUpdating$ = new BehaviorSubject(null);

  public refreshNeeded$ = new BehaviorSubject(null);

  public transScriptData$ = new BehaviorSubject(null);

  public getTranscript(transcriptData : any):Observable<any>{
    return this.http.post<any>(this.transcriptUrl,transcriptData);
  }
  public getMlTranscript(transcriptData : any):Observable<any>{
    return this.http.post<any>(this.getTranscriptUrl,transcriptData);
  }

  public getRecord(transactionId?: string):Observable<any>{
    return this.http.get<any>(this.baseUrl + transactionId);
  }

  public getProceduralData(query): any{
    return this.http.get(this.kbUrl, {
      params: {
        query: query
      },
      // observe: 'response'
    });
  }

  public getAudio(audio: IAudioCallAudit){
    return this.http.post(this.audioUrl, audio)
  }

  public batchRun(){
    return this.http.get<any>(this.batchRunUrl)
  }

  public submitAudit(obj: IPostCallAudit){
    this.isUpdating$.next('Saving the Audit Result');
    return this.http.put(this.baseUrl+"audit-screen", obj).pipe(
      tap(() =>{this.isUpdating$.next('Submitted Sucessfully')
            this.refreshNeeded$.next('')})
    );
  }
  public transcriptByLang(transcriptData:any){
    return this.http.post<any>(this.transcriptMultiLangUrl,transcriptData);
  }

}
