import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { slideUp } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service';
import { ActivatedRoute, Router } from '@angular/Router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-front-office-records',
  templateUrl: './front-office-records.component.html',
  styleUrls: ['./front-office-records.component.scss'],
  animations: [slideUp],
  providers: [DatePipe]
})
export class FrontOfficeRecordsComponent implements OnInit {

  isLoading: boolean = false;
  tableMessage: any = {};
  pageNumber: number = 1;
  pageSize: number = environment.pageSize;
  transactionId1:any;
  id : number;
  response: any;
  modalForm: FormGroup;
  isRecordLoading: boolean;
  agentId:any = 0;

  tableHeaders: any = [
    {id: 1, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 2, name: "Transaction Id", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Agent Name", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Flagged", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Status", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Processing Date", order: 'desc', type: 'date',  class: 'th-sort'},
    {id: 6, name: "Audited Date", order: 'desc', type: 'date',  class: 'th-sort'},
  ];
  tableData: any = [];


  constructor(
    private AuditRecordsService: AuditRecordsService,
    private datePipe: DatePipe,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
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
                2: { value: m.transactionId },
                3: { value: m.agentName },
                4: { value: m.flag },
                5: { value: m.status},
                6: { value: this.datePipe.transform(m.createdOn, 'mediumDate') },
                7: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
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
  tableResultData = [];
  fillTableRows(){
    // console.log('hello')
    this.modalForm = this.formBuilder.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
    });
    this.AuditRecordsService.getbackOfficeRecords().subscribe(response =>{
      this.isLoading = false;
      const transId = ['3ac9f7955d96d1499e866cfd7026369b', 'dd10ccc0e9ef367a5c20a452905018c2', 'cace590a4ca350dc1f9b108c5e3dff86','fca88db6a3e129a0c1031f515ab0accf',
      '0b572c530d217fa0cec5170a7ceb867c_2', '0c4a74c1e2c7f55f014e39bcad748a8c_2', '0c7a71fc46e6ceed4760ca55bc1eec73_2','d1b27960fc38042efc505ca422472a81_2',
      'd8e6ed2d0a534f63159755c803e23b28_2','f4cba1d33e655ecf899562932bf0b18d','7cfa8ab3dec0c89f3c81738cdfdec5b1','161294018088057893ffec9a479e6b1b_2','f4cba1d33e655ecf899562932bf0b18d','7cfa8ab3dec0c89f3c81738cdfdec5b1']
      this.tableData = {
        tableRows: response.filter(f => transId.includes(f.transactionId)).map(m =>({
          0: { value: m.id },
          1: { value: m.id },
          2: { value: m.transactionId },
          3: { value: m.agentName },
          4: { value: m.flag },
          5: { value: m.status},
          6: { value: this.datePipe.transform(m.createdOn, 'mediumDate') },
          7: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
        }))
      }
    })
  }

  receiveRowClickRequest($event){
    this.AuditRecordsService.getRecord($event).subscribe(trnId =>{
      if(trnId.status == 'PENDING'){
        this.toastrService.error('No data available since transaction is pending');
        return
      }else{
      this.transactionId1 = trnId.transactionId;
      this.id = trnId.id;
      this.router.navigate(['/front-office'],
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
      console.log(response);
      if (response.result.length > 0) {
        this.tableData = {
          currentPage: response.pagination.currentPage,
          itemsPerPage: response.pagination.itemsPerPage,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
          pageNumbers: Array(response.pagination.totalPages).fill(0).map((x,i)=>i+1),
          tableRows: response.result.map(m => ({
            0: { value: m.id },
            1: { value: m.id },
            2: { value: m.transactionId },
            3: { value: m.agentName },
            4: { value: m.flag },
            5: { value: m.status},
            6: { value: this.datePipe.transform(m.createdOn, 'mediumDate') },
            7: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
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
