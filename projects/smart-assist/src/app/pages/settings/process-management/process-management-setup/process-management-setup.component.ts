import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProcess } from 'projects/smart-assist/src/app/interfaces/settings/process';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'common_modules/services/helper.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { ProcessService } from 'projects/smart-assist/src/app/services/settings/process.service';
import { CustomerService } from 'projects/smart-assist/src/app/services/settings/customer.service';


@Component({
  selector: 'app-process-management-setup',
  templateUrl: './process-management-setup.component.html',
  styles: []
})
export class ProcessManagementSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  processObj: IProcess;
  modalForm: FormGroup;
  isRecordLoading: boolean = false;
  customerList: any;
  isListLoading: false;

  constructor(
    private toastrService: ToastrService,
    private helperService: HelperService,
    private accountService: AccountService,
    private ProcessService: ProcessService,
    private CustomerService: CustomerService,
    private modalPopupService: ModalPopupService,
    private confirmDialogService: ConfirmDialogService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fillModalPopupWithData(this.modalPopupObj);
    this.CustomerService.GetListofAllCustomer().subscribe(data => this.customerList = data);
  }

  fillModalPopupWithData(modalPopupObj: any){
    if(modalPopupObj.isNewEntry){
      this.modalForm = this.formBuilder.group({
        isActive: [false],
        processName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
        customerId : ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
      });
      this.CustomerService.GetListofAllCustomer()
        .pipe(finalize(() => this.isListLoading = false)).subscribe(data => this.customerList = data);
    }
    else{
      this.isRecordLoading = true;
      this.ProcessService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data => {
        this.modalForm = this.formBuilder.group({
          isActive: [!data.isActive],
          processName: [data.processName, [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
          customerId : [data.customerId, [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
        })
      });
    }
  }

  deleteRecord(){
    Promise.resolve().then(async() => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.ProcessService.delete(this.modalPopupObj.recordId).subscribe();
        this.modalPopupService.closeOrGoToPreviousModalPopup();
      }
    }).catch((error) => {
      console.warn("The given record could not be deleted!");
			console.error(error);
    });
  }

  requiredCheckOnSelectInput(dropDownName:string, dropDownValue:string ){
    if(dropDownName == 'customerSetup' ){
      this.modalForm.controls.customerId.setValue(dropDownValue);
    }
  }

  submitForm(){
    if(!this.modalForm.valid){
      this.toastrService.error('Please add the Process first');
      return;
    }

    const user = this.accountService.getCurrentUserValue();
    this.processObj = {
      id: this.modalPopupObj.recordId,
      processName: this.modalForm.controls['processName'].value,
      customerId: this.modalForm.controls['customerId'].value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      createdOn: this.helperService.getNowUTC(),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
    }

    if(this.modalPopupObj.isNewEntry){
      this.ProcessService.create(this.processObj).subscribe();
    }
    else{
      this.ProcessService.update(this.processObj).subscribe();
    }

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }


}
