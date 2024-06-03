import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { slideUp } from 'common_modules/animations/page-animation';
import { AppRoleService } from 'projects/smart-assist/src/app/services/settings/app-role.service';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { RoleSetupComponent } from '../app-role-setup/app-role-setup.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-role-setting',
  templateUrl: './app-role-setting.component.html',
  styles: [],
  animations: [slideUp],
  providers: [DatePipe]
})
export class RoleSettingComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = environment.pageSize;
  isLoading: boolean = false;
  tableMessage: any = {};

  constructor(
    private appRoleService: AppRoleService,
    private modalPopupService: ModalPopupService,
    private datePipe: DatePipe,
  ) { }
  //add type: 'date' if data type is date
  tableHeaders: any = [
    {id: 1, name: "Id", order: 'desc', type: '',  class: 'th-sort'},
    {id: 2, name: "Name", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Hierarchy#", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 4, name: "Users", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Accesses", order: 'desc', type: '',  class: 'th-sort'},
    {id: 6, name: "Is Active", order: 'desc', type: '',  class: 'th-sort'},
    {id: 7, name: "Updated By", order: 'desc', type: '',  class: 'th-sort'},
    {id: 8, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'}
  ];
  tableData: any = [];
  //Custom initialization
  ngOnInit(): void {
    this.appRoleService.refreshNeeded$.subscribe(() => this.fillTableRows());
    this.appRoleService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text:x });
    this.isLoading = true;
    this.fillTableRows();
  }
  fillTableRows(){
    this.appRoleService.getRecords(this.pageNumber, this.pageSize).pipe(finalize(() => {
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
            3: { value: m.hierarchyNo },
            4: { value: m.totalUsers },
            5: { value: m.totalAccesses },
            6: { value: m.isActive ? 'Yes' : 'No' },
            7: { value: m.updatedBy },
            8: { value: this.datePipe.transform(m.updatedOn, 'mediumDate') },
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
  //UI Events
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
      popupPosition: 'right',
      recordId: recordId,
      isNewEntry: isNewEntry,
      heading: 'User Role Setup',
      width:'60rem',
      popup: RoleSetupComponent
    });
  }
}
