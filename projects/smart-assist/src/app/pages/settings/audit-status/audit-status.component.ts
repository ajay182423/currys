import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { slideUp } from 'common_modules/animations/page-animation';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { AuditStatusSetupComponent } from './audit-status-setup/audit-status-setup.component';
import { AuditStatusService } from 'projects/smart-assist/src/app/services/settings/audit-status.service';

@Component({
  selector: 'app-audit-status',
  templateUrl: './audit-status.component.html',
  styles: [],
  animations: [slideUp],
  providers: [DatePipe]
})
export class AuditStatusComponent implements OnInit {

  isLoading: boolean = false;
  tableMessage: any = {};
  pageNumber: number = 1;
  pageSize: number = environment.pageSize;

  tableHeaders: any = [
    {id: 1, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 2, name: "Status", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Is Active", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Created On", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Updated By", order: 'desc', type: '',  class: 'th-sort'},
    {id: 6, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'}
  ];
  tableData: any = [];

  constructor(
    private AuditStatusService: AuditStatusService,
    private modalPopupService: ModalPopupService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.AuditStatusService.refreshNeeded$.subscribe(() => this.fillTableRows());
    this.AuditStatusService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text:x });
    this.isLoading = true;
    this.fillTableRows();
  }

  fillTableRows(){
    this.AuditStatusService.getRecords(this.pageNumber, this.pageSize).pipe(finalize(() => {
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
            2: { value: m.status },
            3: { value: m.isActive ? 'Yes' : 'No' },
            4: { value: this.datePipe.transform(m.createdOn, 'mediumDate') },
            5: { value: m.updatedBy },
            6: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
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
      heading: 'Add Audit Status',
      width:'55rem',
      popup: AuditStatusSetupComponent
    });
  }

}
