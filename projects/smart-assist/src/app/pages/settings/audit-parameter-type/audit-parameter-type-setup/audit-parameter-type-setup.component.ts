import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'common_modules/services/helper.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { AuditParameterTypeService } from 'projects/smart-assist/src/app/services/settings/audit-parameter-type.service';
import { IParameterType } from 'projects/smart-assist/src/app/interfaces/settings/audit-parameter-type';


@Component({
  selector: 'app-audit-parameter-type-setup',
  templateUrl: './audit-parameter-type-setup.component.html',
  styles: []
})
export class AuditParameterTypeSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  auditParameterTypeObj: IParameterType;
  modalForm: FormGroup;
  isRecordLoading: boolean = false;
  parameterList: any;
  isListLoading: false;


  constructor(
    private toastrService: ToastrService,
    private helperService: HelperService,
    private accountService: AccountService,
    private AuditParameterTypeService: AuditParameterTypeService,
    private modalPopupService: ModalPopupService,
    private confirmDialogService: ConfirmDialogService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fillModalPopupWithData(this.modalPopupObj);
  }

  fillModalPopupWithData(modalPopupObj: any){
    if(modalPopupObj.isNewEntry){
      this.modalForm = this.formBuilder.group({
        isActive: [false],
        parameterName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
        type: ['', [Validators.required]]
      });
    }

    else{
      this.isRecordLoading = true;
      this.AuditParameterTypeService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data => {
        this.modalForm = this.formBuilder.group({
          isActive: [!data.isActive],
          parameterName: [data.parameterName, [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
          type: [data.type, [Validators.required]]
        })
      });
    }
  }

  deleteRecord(){
    Promise.resolve().then(async() => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.AuditParameterTypeService.delete(this.modalPopupObj.recordId).subscribe();
        this.modalPopupService.closeOrGoToPreviousModalPopup();
      }
    }).catch((error) => {
      console.warn("The given record could not be deleted!");
			console.error(error);
    });
  }

  submitForm(){
    if(!this.modalForm.valid){
      this.toastrService.error('Please add the Parameter Type first');
      return;
    }

    const user = this.accountService.getCurrentUserValue();
    this.auditParameterTypeObj = {
      id: this.modalPopupObj.recordId,
      parameterName: this.modalForm.controls['parameterName'].value,
      type: this.modalForm.controls['type'].value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      createdOn: this.helperService.getNowUTC(),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
    }

    if(this.modalPopupObj.isNewEntry){
      this.AuditParameterTypeService.create(this.auditParameterTypeObj).subscribe();
    }
    else{
      this.AuditParameterTypeService.update(this.auditParameterTypeObj).subscribe();
    }

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }

}
