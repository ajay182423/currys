import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { slideUp } from 'common_modules/animations/page-animation';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { ProcessManagementSetupComponent } from './process-management-setup/process-management-setup.component';
import { ProcessService } from 'projects/smart-assist/src/app/services/settings/process.service';


@Component({
  selector: 'app-process-management',
  templateUrl: './process-management.component.html',
  styleUrls: [],
  animations: [slideUp],
  providers: [DatePipe]
})
export class ProcessManagementComponent implements OnInit {

  isLoading: boolean = false;
  tableMessage: any = {};
  pageNumber: number = 1;
  pageSize: number = environment.pageSize;

  tableHeaders: any = [
    {id: 1, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 2, name: "Process Name", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Customer Id", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Is Active", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Created On", order: 'desc', type: '',  class: 'th-sort'},
    {id: 6, name: "Updated By", order: 'desc', type: '',  class: 'th-sort'},
    {id: 7, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'}
  ];
  tableData: any = [];

  constructor(
    private ProcessService: ProcessService,
    private modalPopupService: ModalPopupService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.ProcessService.refreshNeeded$.subscribe(() => this.fillTableRows());
    this.ProcessService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text:x });
    this.isLoading = true;
    this.fillTableRows();
  }

  fillTableRows(){
    this.ProcessService.getRecords(this.pageNumber, this.pageSize).pipe(finalize(() => {
      this.isLoading = false;
      this.tableMessage = { isUpdating: false, text:'' };
    })).subscribe(response => {
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
            2: { value: m.processName },
            3: { value: m.customerId },
            4: { value: m.isActive ? 'Yes' : 'No' },
            5: { value: this.datePipe.transform(m.createdOn, 'mediumDate') },
            6: { value: m.updatedBy },
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

  receiveCreateNewRequest() {
    this.openSetupPopup(0, true);
  }

  receiveRowClickRequest($event) {
    this.openSetupPopup($event, false);
  }

  receivePageChangeRequest($event) {
    this.pageNumber = $event;
    this.isLoading = true;
    this.fillTableRows();
  }


  openSetupPopup(recordId: any, isNewEntry: boolean){
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: recordId,
      isNewEntry: isNewEntry,
      popupPosition: 'right',
      heading: 'Process Management Setup',
      height: '55rem',
      popup: ProcessManagementSetupComponent
    });
  }

}
