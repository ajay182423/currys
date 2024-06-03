import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { DashboardService } from '../../../services/dashboard.service';


@Component({
  selector: 'forms-data-popup',
  templateUrl: './forms-data-popup.component.html',
  styleUrls: ['./forms-data-popup.component.scss'],
  providers: [DatePipe]
})
export class FormsDataPopupComponent implements OnInit {


  @Input() modalPopupObj: any;
  pageNumber: number = 1;
  pageSize: number = 10;
  tableMessage: any = {};
  localStorageUserItem: string = environment.localStorageUserItem;
  loadingText:string;
  isLoading: boolean = false;
  isRecordLoading: boolean = false;
  contextMenuItems: any = [
    { id: 1, icon: 'drive_file_rename_outline', iconSize: '2.1rem', show: true, enabled: true, name: 'Edit' },
    { id: 2, icon: 'download', iconSize: '2.1rem', show: true, enabled: true, name: 'Download' },
    { id: 3, icon: 'arrow_forward', iconSize: '2.1rem', show: true, enabled: true, name: 'Go to Actions' },
  ];



  tableHeaders: any = [
    // {id: 1, name: "Form Id", order: 'asc', type: 'number',  class: 'th-sort-asc'},
    {id: 1, name: "Form Name", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 3, name: "Section Id", order: 'desc', type: 'string',  class: 'th-sort'},
    {id: 2, name: "Section", order: 'desc', type: 'string',  class: 'th-sort'},
    {id: 3, name: "Parameter", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 5, name: "Audit Id", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 6, name: "File Name", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 7, name: "Score", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 8, name: "Confidence", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 9, name: "Audit Result", order: 'desc', type: 'string',  class: 'th-sort'},
    // {id: 8, name: "Created On", order: 'desc', type: 'date',  class: 'th-sort'},
    // {id: 9, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'},
  ];
  tableData: any = [];
  tableData1: any = [];
  linkedAactions: any;


  constructor(private datePipe: DatePipe,
     private dashboardService : DashboardService
    )
    { }

  ngOnInit(): void {

    this.isLoading = true;


    this.fillTableRows();
  }



  fillTableRows(){
    this.dashboardService.GetAllFormsData(this.pageNumber, this.pageSize).pipe(finalize(() => {
      this.isLoading = false;
      this.tableMessage = { isUpdating: false, text:'' };
    })).subscribe(response => {
      console.log(response);


      if (response.result.length > 0) {
        this.tableData = {
          currentPage: response.pagination.currentPage,
          itemsPerPage: response.pagination.itemsPerPage,
          totalItems:  response.pagination.totalItems,
          totalPages:  response.pagination.totalPages,
          pageNumbers: Array(response.result.length*10).fill(0).map((x,i)=>i+1), //Array(response.pagination.totalPages).fill(0).map((x,i)=>i+1),
          tableRows: response.result.map(m => ({
            0:  {value:m.formName},
            1:  {value:m.formName},
            2:  {value:m.section},
            3:  {value:m.parameter},
            // 3:  {value:m.sectionId},
            // 4:  {value:m.section},
            // 5:  {value:m.parameter},
            // 6:  {value:m.fileName},
            // 7:  {value:m.score},
            // 8:  {value:m.confidence},
            // 9:  {value:m.auditResult},
            // 8:  {value:this.datePipe.transform(m.createdOn, 'mediumDate')},
            // 9:  {value:this.datePipe.transform(m.updatedOn, 'mediumDate')},
          }))
        };

        // this.tableData1 = {
        //   currentPage: response.pagination.currentPage,
        //   itemsPerPage: response.pagination.itemsPerPage,
        //   totalItems:  response.pagination.totalItems,
        //   totalPages:  response.pagination.totalPages,
        //   pageNumbers: Array(response.result.length*10).fill(0).map((x,i)=>i+1), //Array(response.pagination.totalPages).fill(0).map((x,i)=>i+1),
        //   tableRows: response.result.filter(f => f.formId == 2).map(m => ({
        //     0:  {value:m.id},
        //     1:  {value:m.id},
        //     2:  {value:m.formId},
        //     3:  {value:m.formName},
        //     4:  {value:m.transactionId},
        //     5:  {value:m.auditId},
        //     6:  {value:m.fileName},
        //     7:  {value:m.score},
        //     8:  {value:m.confidence},
        //     9:  {value:m.auditResult},
        //     // 8:  {value:this.datePipe.transform(m.createdOn, 'mediumDate')},
        //     // 9:  {value:this.datePipe.transform(m.updatedOn, 'mediumDate')},
        //   }))
        // };
      }
      else{
        this.tableData = {
          fileUrl: environment.fileUrl,
          tableRows: []
        };
      }
    });
  }



  receivePageChangeRequest($event) {
    this.pageNumber = $event;
    this.isLoading = true;
    this.fillTableRows();
  }


}
