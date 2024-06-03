import { Component, OnInit } from '@angular/core';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { AppUserService } from 'projects/smart-assist/src/app/services/settings/app-user.service';
import { AppUserSetupComponent } from '../app-user-setup/app-user-setup.component';
import { slideUp } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-app-user-setting',
  templateUrl: './app-user-setting.component.html',
  styles: [],
  animations: [slideUp],
  providers: [DatePipe]
})
export class AppUserSettingComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = environment.pageSize;
  isLoading: boolean = false;
  tableMessage: any = {};

  constructor(
    private appUserService: AppUserService,
    private modalPopupService: ModalPopupService,
    private datePipe: DatePipe,
  ) { }

  //add type: 'date' if data type is date
  tableHeaders: any = [
    { id: 1, name: "Id", order: 'asc', type: '', class: 'th-sort-asc' },
    { id: 2, name: "Username", order: 'desc', type: '', class: 'th-sort' },
    { id: 3, name: "User Full Name", order: 'desc', type: '', class: 'th-sort' },
    { id: 4, name: "Group", order: 'desc', type: '', class: 'th-sort' },
    { id: 5, name: "Is Active", order: 'desc', type: '', class: 'th-sort' },
    { id: 6, name: "Roles", order: 'desc', type: '', class: 'th-sort' },
    { id: 7, name: "Status", order: 'desc', type: '', class: 'th-sort' },
    { id: 8, name: "Last Connected On", order: 'desc', type: 'date', class: 'th-sort' }
  ];
  tableData: any = [];
  //Custom initialization
  ngOnInit(): void {
    this.appUserService.refreshNeeded$.subscribe(() => this.fillTableRows());
    this.appUserService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text: x });
    this.isLoading = true;
    this.fillTableRows();
  }
  fillTableRows() {
    this.appUserService.getRecords(this.pageNumber, this.pageSize).pipe(finalize(() => {
      this.isLoading = false;
      this.tableMessage = { isUpdating: false, text: '' };
    })).subscribe(response => {
      if (response.result.length > 0) {
        this.tableData = {
          currentPage: response.pagination.currentPage,
          itemsPerPage: response.pagination.itemsPerPage,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
          pageNumbers: Array(response.pagination.totalPages).fill(0).map((x, i) => i + 1),
          tableRows: response.result.map(m => ({
            0: { value: m.userName },
            1: { value: m.id },
            2: { value: m.userName },
            3: { value: m.firstName + ' ' + m.lastName },
            4: { value: m.userGroupName },
            5: { value: m.isActive ? 'Yes' : 'No' },
            6: { value: m.appRoleNames?.map(x => x).join(", ") },
            7: { value: m.status },
            8: { value: (new Date(m.lastLoggedInOn).getFullYear() === 1) ? 'Never' : this.datePipe.transform(m.lastLoggedInOn, 'medium') }
          }))
        };
      }
      else {
        this.tableData = {
          fileUrl: environment.fileUrl,
          tableRows: []
        };
      }
    });
  }

  //UI Events
  receiveRowClickRequest($event) {
    this.openSetupPopup($event, false);
  }

  receivePageChangeRequest($event) {
    this.pageNumber = $event;
    this.isLoading = true;
    this.fillTableRows();
  }

  openSetupPopup(recordId: any, isNewEntry: boolean) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: recordId,
      isNewEntry: isNewEntry,
      popupPosition: 'right',
      heading: 'User Setup',
      width: '60rem',
      popup: AppUserSetupComponent
    });
  }
}
