import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { slideUp } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { AuditParameterResultService } from 'projects/smart-assist/src/app/services/pages/audit-parameter-result.service';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-audit-parameter-result',
  templateUrl: './audit-parameter-result.component.html',
  styleUrls: ['./audit-parameter-result.component.scss'],
  animations: [slideUp],
  providers: [DatePipe]
})
export class AuditParameterResultComponent implements OnInit {

  isLoading: boolean = false;
  tableMessage: any = {};
  pageNumber: number = 1;
  pageSize: number = environment.pageSize;
  isRecordLoading: boolean = false;
  transactionId1:any;
  id : number;
  response: any;
  modalForm: FormGroup;
  modalForm1: FormGroup;

  tableHeaders: any = [
    {id: 0, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    // {id: 1, name: "Transaction Id", order: 'desc', filterable: true, type: '',  class: 'th-sort'},
    {id: 1, name: "Audit Question", order: 'desc', type: '', filterable: true,  class: 'th-sort'},
    // {id: 3, name: "File Name", order: 'desc', type: '',  filterable: true, class: 'th-sort'},
    {id: 2, name: "Score", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Confidence", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Call Audited", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Call Date", order: 'desc', type: 'date',  class: 'th-sort'},
    {id: 7, name: "Audited Date", order: 'desc', type: 'date',  class: 'th-sort'},
  ];
  tableData: any = [];

  filterOptionList: any;

  constructor(
    private AuditParameterResultService: AuditParameterResultService,
    private datePipe: DatePipe,
    private router: Router,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.AuditParameterResultService.refreshNeeded$.subscribe(() => this.fillTableRows());
    this.AuditParameterResultService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text:x });
    this.isLoading = true;
    this.fillTableRows();
    this.getFilterableColumn();

    this.modalForm1 = this.formBuilder.group({
      columnName: ['', Validators.required]
    });

  }

  receivePageChangeRequest($event) {
    this.pageNumber = $event;
    this.isLoading = true;
    this.fillTableRows();
  }

  getFilterableColumn() {
    this.filterOptionList =  this.tableHeaders.filter(f => f.filterable == true);
  }

  searchKey(event) {
    if(event){
      let columnName
      if(this.modalForm1.controls['columnName'].value != '') {
         columnName =  (this.filterOptionList[this.modalForm1.controls['columnName'].value-1].name).replace(" ", '');
      }
      else {
        this.toastrService.warning('Please Select Value from Column Dropdown first');
      }

      this.isRecordLoading = true;
      this.isLoading = true;
      this.AuditParameterResultService.getSearchedRecord(columnName, event, this.pageNumber, this.pageSize).pipe(finalize(() => {
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
            // 2: { value: m.transactionId },
            2: { value: m.auditParameterId },
            // 4: { value: m.fileName },
            3: { value: m.score },
            4: { value: m.confidence },
            5: { value: m.auditResult },
            6: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
            7: { value: this.datePipe.transform(m.createdOn, 'mediumDate') },
            }))
          };
        }
        else{
          this.tableData = {
            fileUrl: environment.fileUrl,
            tableRows: []
          };
        }
        this.isLoading = false;
        this.isRecordLoading = false;
      });
    }

    else {
      this.fillTableRows();
    }
  }


  fillTableRows(){
    this.modalForm = this.formBuilder.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
    });
    this.AuditParameterResultService.getRecords(this.pageNumber, this.pageSize).pipe(finalize(() => {
      this.isLoading = false;
      this.tableMessage = { isUpdating: false, text:'' };
    })).subscribe(response => {
      // console.log(response.result);
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
            // 2: { value: m.transactionId },
            2: { value: m.auditParameterId },
            // 4: { value: m.fileName },
            3: { value: m.score },
            4: { value: m.confidence },
            5: { value: m.auditResult },
            6: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
            7: { value: this.datePipe.transform(m.createdOn, 'mediumDate') },
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
    this.AuditParameterResultService.getRecord($event).subscribe(trnId =>{
      this.transactionId1 = trnId.transactionId;
      this.id = trnId.id;
      this.router.navigate(['/call-audit'],
      { queryParams: { transactionId: this.transactionId1, ID: this.id }})
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

    this.AuditParameterResultService.getRecordsByFilter(dateFrom, dateTo, this.pageNumber, this.pageSize).pipe(finalize(() => {
      this.isLoading = false;
      this.tableMessage = { isUpdating: false, text:'' };
    })).subscribe(response => {
      console.log(response.result);
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
            // 2: { value: m.transactionId },
            2: { value: m.auditParameterId },
            // 4: { value: m.fileName },
            3: { value: m.score },
            4: { value: m.confidence },
            5: { value: m.auditResult },
            6: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
            7: { value: this.datePipe.transform(m.createdOn, 'mediumDate') },
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
