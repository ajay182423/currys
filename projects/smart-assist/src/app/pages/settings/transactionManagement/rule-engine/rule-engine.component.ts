import { Component, OnInit } from '@angular/core';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { slideUp } from 'common_modules/animations/page-animation';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { UserGroupService } from 'projects/smart-assist/src/app/services/settings/user-group.service';
import { RuleEngineSetupComponent } from './rule-engine-setup/rule-engine-setup.component';


@Component({
  selector: 'app-rule-engine',
  templateUrl: './rule-engine.component.html',
  styles: [],
  animations: [slideUp],
  providers: [DatePipe]
})
export class RuleEngineComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 20;
  isLoading: boolean = false;
  tableMessage: any = {};

  tableHeaders: any = [
    {id: 1, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 2, name: "Rule Name", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Keyword", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Phrase", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Homonym", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 6, name: "Rule Expression", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 7, name: "Zip", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 8, name: "City", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 9, name: "State", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 10, name: "Country", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 7, name: "Recon Name", order: 'desc', type: '',  class: 'th-sort'},
    {id: 7, name: "Updated By", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 13, name: "Region Name", order: 'desc', type: '',  class: 'th-sort'},
    {id: 8, name: "Is Active", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 15, name: "Updated By", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 16, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'},
    // {id: 17, name: "Created By", order: 'desc', type: '',  class: 'th-sort'},
    // {id: 18, name: "Created On", order: 'desc', type: 'date',  class: 'th-sort'}
  ];
  tableData: any = [];
  constructor(
    private userGroupService: UserGroupService,
    private modalPopupService: ModalPopupService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.userGroupService.refreshNeeded$.subscribe(() => this.fillTableRows());
    this.userGroupService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text:x });
    this.isLoading = true;
    this.fillTableRows();
  }


  fillTableRows(){
    this.userGroupService.getRecords(this.pageNumber, this.pageSize).pipe(finalize(() => {
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
            2: { value: m.name },
            3: { value: m.totalUsers },
            4: { value: m.isActive ? 'Yes' : 'No' },
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
      heading: 'Add New Rules',
      width:'55rem',
      popup: RuleEngineSetupComponent
    });
  }

}
