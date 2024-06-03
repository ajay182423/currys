import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { IEmailList, Priority } from "../interfaces/email-param";
import { IStatsList } from "../interfaces/Stats-param";
import { IUsersList } from "../interfaces/users-param";
import { tap } from "rxjs/operators";
import { ICategorisationList } from "../interfaces/categorisation-param";
import { IEntityUserList } from "../interfaces/entityuser-param";
import { IEmailIncidentList } from "../interfaces/email-incident-param";
import { MailDataEntities } from "../interfaces/mailDataEntities";


@Injectable({
    providedIn: 'root'
})

export class EmailService{
    baseUrl= environment.apiUrl;

    constructor(private http: HttpClient) {}

    private _refreshNeeded$ = new Subject<void>();
    get refreshNeeded$(){
        return this._refreshNeeded$;
    }

    public getEmailsList(): Observable<IEmailList[]>{
        return this.http.get<IEmailList[]>(this.baseUrl+'Emails/mails');
    }

    public getEmailStats(): Observable<IStatsList>{
        return this.http.get<IStatsList>(this.baseUrl+'Emails/stats');
    }

    public getAllUsers(): Observable<IUsersList[]>{
        return this.http.get<IUsersList[]>(this.baseUrl+'Emails/Users')
    }

    public getEmailbyId(convoId:string): Observable<IEmailList>{
        return this.http.get<IEmailList>(this.baseUrl+'Emails/mailsbyConvoId/'+convoId)
    }

    public getUserbyMailboxName(mailboxAdd:string): Observable<IEntityUserList>{
        return this.http.get<IEntityUserList>(this.baseUrl+'Settings/EntityUser/'+mailboxAdd)
    }

    public getDashboardDetailsbyMailbox(mailboxAdd:string): Observable<any>{
      return this.http.get<any>(this.baseUrl+'Emails/dash-details/'+mailboxAdd)
  }
  
  public getDashboardDetailsbyMailboxAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'Emails/dash-details/all')
  }

    public editMailItem(appEmailObj: IEmailList) {
        return this.http.put(this.baseUrl + 'Emails/editMail', appEmailObj).pipe(
          tap(() =>{
            this._refreshNeeded$.next();
          })
        );
      }

      public addCategory(categoryObj: ICategorisationList) {
        return this.http.post(this.baseUrl + 'MyWork/addCategory', categoryObj).pipe(
          tap(() =>{
            this._refreshNeeded$.next();
          })
        );
      }

      public getIntentDistributionList(): Observable<any>{
        return this.http.get<any>(this.baseUrl+'Emails/intentCounts');
      }

      
    public getEmailsIncidentList(): Observable<IEmailIncidentList[]>{
      return this.http.get<IEmailIncidentList[]>(this.baseUrl+'Emails/mail-items');
    }

    public getEmailsIncidentListByUsersTeam(): Observable<IEmailIncidentList[]>{
      return this.http.get<IEmailIncidentList[]>(this.baseUrl+'Emails/mail-items/teams');
    }
    
    public getEmailsIncidentListByUser(userName:string): Observable<IEmailIncidentList[]>{
      return this.http.get<IEmailIncidentList[]>(this.baseUrl+'Emails/mail-items/' + userName);
    }

    public getEmailsSentIncidentList(): Observable<IEmailIncidentList[]>{
      return this.http.get<IEmailIncidentList[]>(this.baseUrl+'Emails/mail-items-sent');
    }

    public getEmailsbyConversationThreadList(conversationThreadId:string): Observable<IEmailIncidentList[]>{
      return this.http.get<IEmailIncidentList[]>(this.baseUrl+'Emails/connected-mails/'+conversationThreadId);
    }



    public editMailIncidentItem(appEmailObj: IEmailIncidentList) {
      return this.http.put(this.baseUrl + 'Emails/add-incidentId', appEmailObj).pipe(
        tap(() =>{
          this._refreshNeeded$.next();
        })
      );
    }

    public editAutoReply(appEmailObj: IEmailIncidentList) {
      return this.http.put(this.baseUrl + 'Emails/add-autoreply', appEmailObj).pipe(
        tap(() =>{
          this._refreshNeeded$.next();
        })
      );
    }

    public addNewMailwithIncident(mailObj: IEmailList) {
      return this.http.post(this.baseUrl + 'Emails​/add-mails', mailObj).pipe(
        tap(() =>{
          this._refreshNeeded$.next();
        })
      );
    }
    
    public getMailDataEntities(mailDataId:number): Observable<MailDataEntities[]>{
      return this.http.get<MailDataEntities[]>(this.baseUrl+'Intent/'+ mailDataId);
    }

    public addMailDataEntities(mailDataId:number,mailDataEntitiesObj:any){
      return this.http.post(this.baseUrl + 'Intent/'+ mailDataId, mailDataEntitiesObj).pipe(
        tap(() =>{
          this._refreshNeeded$.next();
        })
      );
  }
  
  public setPriorityByConversationId(priority: number, conversationId: string) {
    return this.http.post(this.baseUrl + 'Emails/flag/conversation/' + conversationId,priority).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  public setEmailPriority(priorityObj: Priority, id: number) {
    return this.http.post(this.baseUrl + 'Emails/flag/' + id, priorityObj).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
}