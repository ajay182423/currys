import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { slideUp } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { UserGroupService } from 'projects/smart-assist/src/app/services/settings/user-group.service';
import { UserGroupSetupComponent } from '../user-group-setup/user-group-setup.component';

@Component({
  selector: 'app-user-group-setting',
  templateUrl: './user-group-setting.component.html',
  styles: [],
  animations: [slideUp],
  providers: [DatePipe]
})
export class UserGroupSettingComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = environment.pageSize;
  isLoading: boolean = false;
  tableMessage: any = {};

  //add type: 'date' if data type is date
  tableHeaders: any = [
    {id: 1, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 2, name: "Group", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Users", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Is Active", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Updated By", order: 'desc', type: '',  class: 'th-sort'},
    {id: 6, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'}
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
      heading: 'User Group Setup',
      width:'55rem',
      popup: UserGroupSetupComponent
    });
  }
}
