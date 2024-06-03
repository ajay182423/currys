import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IAppRole, IAppRoleSpecialAccess } from 'projects/smart-assist/src/app/interfaces/settings/app-role';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { AppRoleService } from 'projects/smart-assist/src/app/services/settings/app-role.service';
import { HelperService } from 'common_modules/services/helper.service';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-role-setup',
  templateUrl: './app-role-setup.component.html',
  styles: [
  ]
})
export class RoleSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  isRecordLoading: boolean = false;
  isListLoading: boolean = false;

  constructor(
    private helperService: HelperService,
    private accountService: AccountService,
    private confirmDialogService: ConfirmDialogService,
    private toastrService: ToastrService,
    private appRoleService: AppRoleService,
    private formBuilder: FormBuilder,
    private modalPopupService: ModalPopupService
  ) { }

  //data variables
  appRoleObj: IAppRole;
  specialAccessList: IAppRoleSpecialAccess[];
  modalForm: FormGroup;
  //Custom initialization
  ngOnInit(): void {
    this.fillModalPopupWithData(this.modalPopupObj);
  }

  //UI Events
  async fillModalPopupWithData(modalPopupObj: any) {
    if (modalPopupObj.isNewEntry) {
      this.modalForm = this.formBuilder.group({
        isActive: [false],
        hierarchyNo: [{ value: '', disabled: false }, [Validators.required, Validators.pattern('^[0-9]*$')]],
        name: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(4), Validators.maxLength(16), Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
        description: [{ value: '', disabled: false }, [Validators.maxLength(255), Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
      })
      //get accesses list
      this.isListLoading = true;
      this.appRoleService.getSpecialAccessesForRoleSetup(0).pipe(finalize(() => this.isListLoading = false)).subscribe(data => this.specialAccessList = data);
    }
    else {
      this.isRecordLoading = true;
      const getRecord = await this.appRoleService.getRecord(modalPopupObj.recordId).toPromise();
      if (getRecord) {
        this.modalForm = this.formBuilder.group({
          isActive: [!getRecord.isActive],
          hierarchyNo: [{ value: getRecord.hierarchyNo, disabled: false }, [Validators.required, Validators.pattern('^[0-9]*$')]],
          name: [{ value: getRecord.name, disabled: false }, [Validators.required, Validators.minLength(4), Validators.maxLength(16), Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
          description: [{ value: getRecord.description, disabled: false }, [Validators.maxLength(255), Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
        });
        this.isListLoading = true;
        this.appRoleService.getSpecialAccessesForRoleSetup(getRecord.id).pipe(finalize(() => this.isListLoading = false)).subscribe(data => this.specialAccessList = data);
        this.isRecordLoading = false;
      }
    }
  }
  deleteRecord() {
    Promise.resolve().then(async () => {
      if (await this.confirmDialogService.openConfirmDialog('Delete user role', 'Are you sure you want to permanently delete this user role record?')) {
        this.appRoleService.delete(this.modalPopupObj.recordId).subscribe();
        this.modalPopupService.closeOrGoToPreviousModalPopup();
      }
    }).catch((error) => {
      console.warn("The given record could not be deleted!");
      console.error(error);
    });
  }
  submitForm() {
    //Validate user input
    if (Number(this.modalForm.controls['hierarchyNo'].value) < 1) {
      this.toastrService.error('User Role Hierarchy No cannot be less than 1');
      return;
    }
    if (!this.modalForm.valid) {
      this.toastrService.error('Please complete the user role setup first');
      return;
    }
    //Get access selection
    let specialAccessIds: number[] = [];
    this.specialAccessList.forEach(item => {
      if (item.isAccessOn) specialAccessIds.push(item.id);
    });
    //Create role object to post/put
    const user = this.accountService.getCurrentUserValue();
    this.appRoleObj = {
      id: this.modalPopupObj.recordId,
      hierarchyNo: Number(this.modalForm.controls['hierarchyNo'].value),
      name: this.modalForm.controls['name'].value,
      description: this.modalForm.controls['description'].value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
      totalUsers: 0,
      totalAccesses: 0,
      specialAccessIds: specialAccessIds,
    }

    if (this.modalPopupObj.isNewEntry) {
      this.appRoleService.create(this.appRoleObj).subscribe();
    }
    else {
      this.appRoleService.update(this.appRoleObj).subscribe();
    }
    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }

}
