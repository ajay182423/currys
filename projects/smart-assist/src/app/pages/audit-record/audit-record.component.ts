import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { slideUp } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service';
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-audit-record',
  templateUrl: './audit-record.component.html',
  styleUrls: ['./audit-record.component.scss'],
  animations: [slideUp],
  providers: [DatePipe]
})
export class AuditRecordComponent implements OnInit {

  isLoading: boolean = false;
  tableMessage: any = {};
  pageNumber: number = 1;
  pageSize: number = environment.pageSize;
  transactionId1:any;
  id : number;
  response: any;
  modalForm: FormGroup;

  tableHeaders: any = [
    {id: 1, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 2, name: "Call Duration", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Quality(%)", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Flagged", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Status", order: 'desc', type: '',  class: 'th-sort'},
    {id: 6, name: "Call Date", order: 'desc', type: 'date',  class: 'th-sort'},
    {id: 7, name: "Audited Date", order: 'desc', type: 'date',  class: 'th-sort'},
  ];
  tableData: any = [];
  isRecordLoading: boolean;
  agentId:any = 0;

  constructor(
    private AuditRecordsService: AuditRecordsService,
    private datePipe: DatePipe,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.AuditRecordsService.refreshNeeded$.subscribe(() => this.fillTableRows());
    this.AuditRecordsService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text:x });
    this.isLoading = true;
    this.fillTableRows();
  }

  receivePageChangeRequest($event) {
    this.pageNumber = $event;
    this.isLoading = true;
    this.fillTableRows();
  }

  searchKey(event) {
    if(event){
      this.isRecordLoading = true;
      this.AuditRecordsService.getSearchedRecord(event, this.pageNumber, this.pageSize).pipe(finalize(() => {
        this.isLoading = false;
        this.tableMessage = { isUpdating: false, text:'' };
      })).subscribe(response => {
        console.log(response)
        this.response = response;
        if (this.response.result.length > 0) {
          this.tableData = {
            currentPage: response.pagination.currentPage,
            itemsPerPage: response.pagination.itemsPerPage,
            totalItems: response.pagination.totalItems,
            totalPages: response.pagination.totalPages,
            pageNumbers: Array(response.pagination.totalPages).fill(0).map((x,i)=>i+1),
            tableRows: response.result.map(m => ({
              0: { value: m.id },
              1: { value: m.id },
              2: { value: m.callDuration },
              3: { value: m.quality },
              4: { value: m.flag },
              5: { value: m.status, class: m.status.toLowerCase() },
              6: { value: this.datePipe.transform(m.callDate, 'mediumDate') },
              7: { value: this.datePipe.transform(m.auditedDate, 'mediumDate') },
            }))
          };
        }
        else{
          this.tableData = {
            fileUrl: environment.fileUrl,
            tableRows: []
          };
        }
        this.isRecordLoading = false;
      });
    }
    else {
      this.fillTableRows();
    }
}

recieveData(event){
  // this.dataToTable.emit(event)
}

  fillTableRows(){

    this.modalForm = this.formBuilder.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
    });

    this.AuditRecordsService.getRecords(this.pageNumber, this.pageSize).pipe(finalize(() => {
      this.isLoading = false;
      this.tableMessage = { isUpdating: false, text:'' };
    })).subscribe(response => {
      this.response = response;
      if (this.response.result.length > 0) {
        this.tableData = {
          currentPage: response.pagination.currentPage,
          itemsPerPage: response.pagination.itemsPerPage,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
          pageNumbers: Array(response.pagination.totalPages).fill(0).map((x,i)=>i+1),
          tableRows: response.result.map(m => ({
            0: { value: m.id },
            1: { value: m.id },
            2: { value: m.callDuration },
            3: { value: m.quality },
            4: { value: m.flag },
            5: { value: m.status, class: m.status.toLowerCase() },
            6: { value: this.datePipe.transform(m.callDate, 'mediumDate') },
            7: { value: this.datePipe.transform(m.auditedDate, 'mediumDate') },
          }))
        };
      }
      else{
        this.tableData = {
          fileUrl: environment.fileUrl,
          tableRows: []
        };
      }
    });
  }

  receiveRowClickRequest($event){
    this.AuditRecordsService.getRecord($event).subscribe(trnId =>{
      if(trnId.status == 'PENDING'){
        this.toastrService.error('No data available since transaction is pending');
        return
      }else{
      this.transactionId1 = trnId.transactionId;
      this.id = trnId.id;
      this.router.navigate(['/call-audit'],
      { queryParams: { transactionId: this.transactionId1, ID: this.id }
      })
      }
    })
  }

  resetFilter() {
    this.fillTableRows();
  }

  submitForm(){
    if(!this.modalForm.valid){
      this.toastrService.error('Please complete the setup first');
      return;
    }

    let dateFrom = this.modalForm.controls['dateFrom'].value;
    let dateTo = this.modalForm.controls['dateTo'].value;

    this.AuditRecordsService.getRecordsByFilter(dateFrom, dateTo, this.pageNumber, this.pageSize).pipe(finalize(() => {
      this.isLoading = false;
      this.tableMessage = { isUpdating: false, text:'' };
    })).subscribe(response => {
      // console.log(response.result);
      if (this.response.result.length > 0) {
        this.tableData = {
          currentPage: response.pagination.currentPage,
          itemsPerPage: response.pagination.itemsPerPage,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
          pageNumbers: Array(response.pagination.totalPages).fill(0).map((x,i)=>i+1),
          tableRows: response.result.map(m => ({
            0: { value: m.id },
            1: { value: m.id },
            2: { value: m.callDuration },
            3: { value: m.quality },
            4: { value: m.flag },
            5: { value: m.status, class: m.status.toLowerCase() },
            6: { value: this.datePipe.transform(m.callDate, 'mediumDate') },
            7: { value: this.datePipe.transform(m.auditedDate, 'mediumDate') },
          }))
        };
      }
      else{
        this.tableData = {
          fileUrl: environment.fileUrl,
          tableRows: []
        };
      }
    });
  }


}
