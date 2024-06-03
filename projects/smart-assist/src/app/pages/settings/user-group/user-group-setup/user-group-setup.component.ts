import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IUserGroup } from 'projects/smart-assist/src/app/interfaces/settings/user-group';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { HelperService } from 'common_modules/services/helper.service';
import { finalize } from 'rxjs/operators';
import { UserGroupService } from 'projects/smart-assist/src/app/services/settings/user-group.service';

@Component({
  selector: 'app-user-group-setup',
  templateUrl: './user-group-setup.component.html',
  styles: [
  ]
})
export class UserGroupSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  userGroupObj: IUserGroup;
  modalForm: FormGroup;
  isRecordLoading: boolean = false;

  constructor(
    private helperService: HelperService,
    private accountService: AccountService,
    private confirmDialogService: ConfirmDialogService,
    private toastrService: ToastrService,
    private userGroupService: UserGroupService,
    private formBuilder: FormBuilder,
    private modalPopupService: ModalPopupService,
  ) { }

  ngOnInit(): void {
    this.fillModalPopupWithData(this.modalPopupObj);
  }

  fillModalPopupWithData(modalPopupObj: any){
    if(modalPopupObj.isNewEntry){
      this.modalForm = this.formBuilder.group({
        isActive: [false],
        name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
      });
    }
    else{
      this.isRecordLoading = true;
      this.userGroupService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data => {
        this.modalForm = this.formBuilder.group({
          isActive: [!data.isActive],
          name: [data.name, [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
        })
      });
    }
  }

  deleteRecord(){
    Promise.resolve().then(async() => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.userGroupService.delete(this.modalPopupObj.recordId).subscribe();
        this.modalPopupService.closeOrGoToPreviousModalPopup();
      }
    }).catch((error) => {
      console.warn("The given record could not be deleted!");
			console.error(error);
    });
  }

  submitForm(){
    if(!this.modalForm.valid){
      this.toastrService.error('Please complete the setup first');
      return;
    }

    const user = this.accountService.getCurrentUserValue();
    this.userGroupObj = {
      id: this.modalPopupObj.recordId,
      name: this.modalForm.controls['name'].value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
      totalUsers: 0,
    }

    if(this.modalPopupObj.isNewEntry){
      this.userGroupService.create(this.userGroupObj).subscribe();
    }
    else{
      this.userGroupService.update(this.userGroupObj).subscribe();
    }

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }
}
