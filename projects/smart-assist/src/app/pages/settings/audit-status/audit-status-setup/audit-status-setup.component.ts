import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAuditStatus } from 'projects/smart-assist/src/app/interfaces/settings/audit-status';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'common_modules/services/helper.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { AuditStatusService } from 'projects/smart-assist/src/app/services/settings/audit-status.service';

@Component({
  selector: 'app-audit-status-setup',
  templateUrl: './audit-status-setup.component.html',
  styles: [
  ]
})
export class AuditStatusSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  auditStatusObj: IAuditStatus;
  modalForm: FormGroup;
  isRecordLoading: boolean = false;

  constructor(
    private toastrService: ToastrService,
    private helperService: HelperService,
    private accountService: AccountService,
    private AuditStatusService: AuditStatusService,
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
        status : ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
      });
    }
    else{
      this.isRecordLoading = true;
      this.AuditStatusService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data => {
        this.modalForm = this.formBuilder.group({
          isActive: [!data.isActive],
          status: [data.status, [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
        })
      });
    }
  }

  deleteRecord(){
    Promise.resolve().then(async() => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.AuditStatusService.delete(this.modalPopupObj.recordId).subscribe();
        this.modalPopupService.closeOrGoToPreviousModalPopup();
      }
    }).catch((error) => {
      console.warn("The given record could not be deleted!");
			console.error(error);
    });
  }

  submitForm(){
    if(!this.modalForm.valid){
      this.toastrService.error('Please add the question first');
      return;
    }

    const user = this.accountService.getCurrentUserValue();
    this.auditStatusObj = {
      id: this.modalPopupObj.recordId,
      status: this.modalForm.controls['status'].value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      createdOn: this.helperService.getNowUTC(),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
    }

    if(this.modalPopupObj.isNewEntry){
      this.AuditStatusService.create(this.auditStatusObj).subscribe();
    }
    else{
      this.AuditStatusService.update(this.auditStatusObj).subscribe();
    }

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }


}
