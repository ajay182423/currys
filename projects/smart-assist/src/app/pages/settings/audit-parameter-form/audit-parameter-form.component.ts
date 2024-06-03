import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { slideUp } from 'common_modules/animations/page-animation';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { AuditParameterFormService } from 'projects/smart-assist/src/app/services/settings/audit-parameter-form.service';
import { AuditParameterFormSetupComponent } from '../audit-parameter-form/audit-parameter-form-setup/audit-parameter-form-setup.component'


@Component({
  selector: 'app-audit-parameter-form',
  templateUrl: './audit-parameter-form.component.html',
  styles: [],
  animations: [slideUp],
  providers: [DatePipe]
})
export class AuditParameterFormComponent implements OnInit {

  isLoading: boolean = false;
  tableMessage: any = {};
  pageNumber: number = 1;
  pageSize: number = environment.pageSize;

  tableHeaders: any = [
    {id: 1, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 2, name: "Form Id", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Process Id", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "QA Name", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Audit Parameter Id", order: 'desc', type: '',  class: 'th-sort'},
    {id: 6, name: "Assign To", order: 'desc', type: '',  class: 'th-sort'},
    {id: 7, name: "Is Active", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 8, name: "Created On", order: 'desc', type: 'date',  class: 'th-sort'},
    {id: 8, name: "Updated By", order: 'desc', type: '',  class: 'th-sort'},
    {id: 9, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'}
  ];
  tableData: any = [];

  constructor(
    private AuditParameterFormService: AuditParameterFormService,
    private modalPopupService: ModalPopupService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.AuditParameterFormService.refreshNeeded$.subscribe(() => this.fillTableRows());
    this.AuditParameterFormService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text:x });
    this.isLoading = true;
    this.fillTableRows();
  }

  fillTableRows(){
    this.AuditParameterFormService.getRecords(this.pageNumber, this.pageSize).pipe(finalize(() => {
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
            2: { value: m.formId },
            3: { value: m.processId },
            4: { value: m.qa},
            5: { value: m.auditParameterId},
            6: { value: m.assignedTo},
            7: { value: m.isActive ? 'Yes' : 'No' },
            // 8: { value: this.datePipe.transform(m.createdDate, 'short') },
            8: { value: m.updatedBy },
            9: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
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
      heading: 'Add Audit Parameter Form',
      width:'65rem',
      popup: AuditParameterFormSetupComponent
    });
  }

}
