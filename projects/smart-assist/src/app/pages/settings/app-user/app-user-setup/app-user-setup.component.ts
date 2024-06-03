import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { AppUserService } from 'projects/smart-assist/src/app/services/settings/app-user.service';
import { DatePipe } from '@angular/common';
import { IDropDown } from 'common_modules/interfaces/drop-down';
import { HelperService } from 'common_modules/services/helper.service';
import { finalize } from 'rxjs/operators';
import { IMultiSelectDropDown } from 'common_modules/interfaces/multi-select-drop-down';
import { IAppUserUpdate } from 'projects/smart-assist/src/app/interfaces/settings/app-user';

@Component({
  selector: 'app-app-user-setup',
  templateUrl: './app-user-setup.component.html',
  styles: [
  ],
  providers: [DatePipe]
})
export class AppUserSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  appUserObj: IAppUserUpdate;
  userGroupList: IDropDown[];
  appRoleList: IMultiSelectDropDown[];
  modalForm: FormGroup;
  userGroupSelectError: boolean = false;
  timeZoneSelectError: boolean = false;
  trackingTypeSelectError: boolean = false;
  isRecordLoading: boolean = false;

  constructor(
    private helperService: HelperService,
    private accountService: AccountService,
    private toastrService: ToastrService,
    private appUserService: AppUserService,
    private formBuilder: FormBuilder,
    private modalPopupService: ModalPopupService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.accountService.getUserGroupNamesForSetup().subscribe(data => this.userGroupList = data);
    this.fillModalPopupWithData(this.modalPopupObj);
  }

  fillModalPopupWithData(modalPopupObj: any){
    this.isRecordLoading = true;
    this.appUserService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data => {
      this.modalForm = this.formBuilder.group({
        //disabled
        userName: [{value: data.userName, disabled: true}],
        firstName: [{value: data.firstName, disabled: true}],
        lastName: [{value: data.lastName, disabled: true}],
        email: [{value: data.email, disabled: true}],
        isActive: [{value: data.isActive ? 'Active' : 'Disabled', disabled: true}],
        lastLoggedInOn: [{value: (new Date(data.lastLoggedInOn).getFullYear() === 1) ? 'Never' : this.datePipe.transform(data.lastLoggedInOn, 'medium'), disabled: true}],
        //editable
        userGroupId: [{value: data.userGroupId.toString(), disabled: false}],
      });
      this.appRoleList = data.appRoleList;
    });
  }

  submitForm(){
    if(!this.modalForm.valid || this.userGroupSelectError || this.timeZoneSelectError || this.trackingTypeSelectError){
      this.toastrService.error('Please complete the setup first');
      return;
    }

    let appRoleList2: IMultiSelectDropDown[] = [];
    this.appRoleList.forEach(item => {
      if (item.isSelected) appRoleList2.push(item);
    });

    const user = this.accountService.getCurrentUserValue();
    this.appUserObj = {
      userName: this.modalPopupObj.recordId,
      appRoleList: appRoleList2,
      userGroupId: Number(this.modalForm.controls['userGroupId'].value),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
    }

    this.appUserService.update(this.appUserObj).subscribe();

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }

  requiredCheckOnSelectInput(selectType, value){
    if(selectType === "UserGroup"){
      if(value === "0") this.userGroupSelectError = true;
      else this.userGroupSelectError = false;
    }
    else if(selectType === "TimeZone"){
      if(value === "0") this.timeZoneSelectError = true;
      else this.timeZoneSelectError = false;
    }
    else if(selectType === "TrackingType"){
      if(value === "0") this.trackingTypeSelectError = true;
      else this.trackingTypeSelectError = false;
    }
  }

}
