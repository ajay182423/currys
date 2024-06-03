import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, pipe, Subject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { ILabelValuesList } from "../interfaces/label-values-param";
import { IStatsList } from "../interfaces/Stats-param";
import { IMailboxList } from "../interfaces/mailbox-param";
import { ITeamStatsList } from "../interfaces/teamstats-param";
import { IDashboardParamList } from "../interfaces/dashboardstats-param";
import { ITATPerformance } from "../interfaces/tat-performance-param";
import { SlaPerformancePopup } from '../interfaces/SlaPerformanceItemPopup';
import { SlaPerformance } from '../interfaces/slaPerformance';
import { getPaginatedResult, getPaginationHeaders } from "common_modules/helpers/paginationHelper";
import { IAuditRecords } from "../interfaces/pages/audit-record";
import { IAuditParameterResult } from "../interfaces/pages/audit-parameter-result";
import { IAgentScore } from "../interfaces/pages/agent-score";

@Injectable({
    providedIn: 'root'
})

export class AgentDashboardService{
    baseUrl= environment.apiUrl + 'agentdashboard/';

    constructor(private http: HttpClient) {}

    public isUpdating$ = new BehaviorSubject(null);

    private _refreshNeeded$ = new Subject<void>();
    get refreshNeeded$(){
        return this._refreshNeeded$;
    }

    public getCompletedItemsList(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/dailyInventoryC');
    }
    
    public getPendingItemsList(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/dailyInventoryP');
    }
    
    public getTotalItemsList(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/dailyInventoryT');
    }

    public getCompletedItemsMonthlyList(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/monthlyInventoryC');
    }
    
    public getPendingItemsMonthlyList(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/monthlyInventoryP');
    }
    
    public getTotalItemsMonthlyList(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/monthlyInventoryT');
    }

    public getStatsbyMailbox(mailboxAd:string):Observable<IDashboardParamList>{
        return this.http.get<IDashboardParamList>(this.baseUrl+'Emails/Stats/'+mailboxAd);
    }
    
    public getMailboxAddress():Observable<IMailboxList[]>{
        return this.http.get<IMailboxList[]>(this.baseUrl+'Emails/mailboxAddress');
    }

    public getTeamStatsList():Observable<ITeamStatsList[]>{
        return this.http.get<ITeamStatsList[]>(this.baseUrl+'Emails/TeamStats');
    }
    public getStatsbyMailboxTotal(mailboxAd:string):Observable<IDashboardParamList>{
        return this.http.get<IDashboardParamList>(this.baseUrl+'Emails/Statstotal/'+mailboxAd);
    }
    public getStatsbyMailboxMonthly(mailboxAd:string):Observable<IDashboardParamList>{
        return this.http.get<IDashboardParamList>(this.baseUrl+'Emails/Statsmonth/'+mailboxAd);
    }
    public getStatsbyMailboxWeekly(mailboxAd:string):Observable<IDashboardParamList>{
        return this.http.get<IDashboardParamList>(this.baseUrl+'Emails/Statsweekly/'+mailboxAd);
    }

    public getStatsAvgTAT(timePeriod:string):Observable<any>{
        return this.http.get<any>(this.baseUrl+'Reports/TAT/'+timePeriod);
    }
    
    public getStatsAvgTATTotal(mailboxAdd:string):Observable<any>{
        return this.http.get<any>(this.baseUrl+'Reports/TATTotal/'+mailboxAdd);
    }
    public getStatsAvgTATMonth(mailboxAdd:string):Observable<any>{
        return this.http.get<any>(this.baseUrl+'Reports/TATMonthly/'+mailboxAdd);
    }
    public getStatsAvgTATWeek(mailboxAdd:string):Observable<any>{
        return this.http.get<any>(this.baseUrl+'Reports/TATWeekly/'+mailboxAdd);
    }
    public getStatsAvgTATToday(mailboxAdd:string):Observable<any>{
        return this.http.get<any>(this.baseUrl+'Reports/TATToday/'+mailboxAdd);
    }

    public getCountofMailboxChart(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/countbyMailbox');
    }
    
    public getCountofIntentChart(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/casesbyIntent');
    }

    public getCountofSLAPerformanceChart(): Observable<ILabelValuesList>{
        return this.http.get<ILabelValuesList>(this.baseUrl+'Emails/monthlySlaperformance');
    }

    public getSLAPerformanceItemPopup(): Observable<SlaPerformancePopup>{
        return this.http.get<SlaPerformancePopup>(this.baseUrl+'Emails/monthlySlaperformanceItems');
    }

    public getSlaPerformance(): Observable<SlaPerformance>{
        return this.http.get<SlaPerformance>(this.baseUrl+'Emails/SlaPerformance');
    }

    public getCountofTATPerformanceChart(): Observable<ITATPerformance>{
        return this.http.get<ITATPerformance>(this.baseUrl+'Emails/tatPerformance');
    }

    public getSentimentDetails(timePeriod:string,mailboxAdd:string):Observable<any>{
        return this.http.get<any>(this.baseUrl+'Reports/get-sentiment/'+timePeriod+'/'+mailboxAdd);
    }

    // public getPriorityDetails(timePeriod:string):Observable<any>{
    //     return this.http.get<any>(this.baseUrl+'Dashboard/PriorityCount/'+timePeriod);
    // }
    public getPriorityYearDetails():Observable<any>{
        return this.http.get<any>(this.baseUrl+'Dashboard/Priority/year');
    }
    public getPriorityMonthDetails():Observable<any>{
        return this.http.get<any>(this.baseUrl+'Dashboard/Priority/month');
    }
    public getPriorityDayDetails():Observable<any>{
        return this.http.get<any>(this.baseUrl+'Dashboard/Priority/day');
    }

    // New Methods 

    public getAuditRecordsForSetup(agentId: number) {
        return this.http.get<IAuditRecords[]>(this.baseUrl + 'audit-records-list/' + agentId);
      }

      public getParameterResultsForSetup(agentId: number) {
        return this.http.get<IAuditParameterResult[]>(this.baseUrl + 'parameter-results-list/' + agentId);
      }

    public getSections(agentId:number): Observable<any>{
        return this.http.get<any>(this.baseUrl + 'section-audit-pass-summary/' + agentId);
      }
    public getSectionsFailedByDay(agentId:number): Observable<any>{
        return this.http.get<any>(this.baseUrl + 'section-audit-failed-day/'+agentId );
      }
      
    public getSectionsFailedByMonth(agentId:number): Observable<any>{
        return this.http.get<any>(this.baseUrl + 'section-audit-failed-month/'+ agentId);
      }
      
      public getSectionData(sectionId :number, page?: number, itemsPerPage?: number ): Observable<any>{
          let params = getPaginationHeaders(page, itemsPerPage);
        return getPaginatedResult<any[]>(this.baseUrl  + 'section-audit-pass-data/'+ sectionId, params, this.http).pipe(
          tap(response => { this.isUpdating$.next(''); return response; }),
          catchError((err) => { this.isUpdating$.next(''); throw ''; })
        );
      }

      public getDayWiseTransactions(agentId:number): Observable<any>{
        return this.http.get<any>(this.baseUrl + 'get-day-wise-transactions/' + agentId);
      }
      public getMonthTransactions(agentId:number): Observable<any>{
        return this.http.get<any>(this.baseUrl + 'get-month-wise-transactions/' + agentId);
      }

    public getCompliance(formId:number, sectionId: number ): Observable<any>{
        return this.http.get<any>(this.baseUrl + 'compliance/'+formId+ '/'+sectionId);
      }

      public GetAllFormsData( page?: number, itemsPerPage?: number ): Observable<any>{
        let params = getPaginationHeaders(page, itemsPerPage);
        return getPaginatedResult<any[]>(this.baseUrl  + 'all-forms-data', params, this.http).pipe(
            tap(response => { this.isUpdating$.next(''); return response; }),
            catchError((err) => { this.isUpdating$.next(''); throw ''; })
            );
        }
        
        public getTableData( page?: number, itemsPerPage?: number ): Observable<any>{
            let params = getPaginationHeaders(page, itemsPerPage);
            return getPaginatedResult<any[]>(this.baseUrl  + 'table-data', params, this.http).pipe(
                tap(response => { this.isUpdating$.next(''); return response; }),
                catchError((err) => { this.isUpdating$.next(''); throw ''; })
                );
            }

            public getSearchedTableData(query:string, page?: number, itemsPerPage?: number ): Observable<any>{
                let params = getPaginationHeaders(page, itemsPerPage);
                return getPaginatedResult<any[]>(this.baseUrl  + 'searched-table-data/'+ query, params, this.http).pipe(
                    tap(response => { this.isUpdating$.next(''); return response; }),
                    catchError((err) => { this.isUpdating$.next(''); throw ''; })
                    );
                }
            
        public getQueryStatus(agentId: number): Observable<any>{
            return this.http.get<any>(this.baseUrl + 'customer-query-status/'+ agentId);
        }

        public getIDVComplianceData(agentId:number): Observable<any>{
            return this.http.get<any>(this.baseUrl + 'idv-compliance/' + agentId + '/daily');
        }

        public getPCIComplianceData(agentId:number): Observable<any>{
            return this.http.get<any>(this.baseUrl + 'pci-compliance/' + agentId+ '/daily');
        }

        public getAgentDataById(agentId:number): Observable<any>{
            return this.http.get<any>(this.baseUrl + 'get-agent-data-by-id/'+ agentId);
        }

        public getRecordsByAgentId(agentId:number): Observable<any>{
            return this.http.get<any>(this.baseUrl + 'filter-records-by-agent-id/' + agentId);
        }

        public getRecordsListByAgentId(agentId:number, page?: number, itemsPerPage?: number) {
            let params = getPaginationHeaders(page, itemsPerPage);
            return getPaginatedResult<IAgentScore[]>(this.baseUrl + 'filter-records-list-by-agent-id/' + agentId, params, this.http).pipe(
              tap(response => { this.isUpdating$.next(''); return response; }),
              catchError((err) => { this.isUpdating$.next(''); throw ''; })
            );
          }
        public getSortedRecordsListByAgentId(sortBy:string, order:string, agentId:number, page?: number, itemsPerPage?: number) {
            let params = getPaginationHeaders(page, itemsPerPage);
            return getPaginatedResult<IAgentScore[]>(this.baseUrl + 'sort-records-list-by-agent-id/' + agentId + '/' + sortBy +'/' + order, params, this.http).pipe(
              tap(response => { this.isUpdating$.next(''); return response; }),
              catchError((err) => { this.isUpdating$.next(''); throw ''; })
            );
          }
}