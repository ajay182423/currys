import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'common_modules/services/helper.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { Icustomer } from 'projects/smart-assist/src/app/interfaces/settings/customer';
import { CustomerService } from 'projects/smart-assist/src/app/services/settings/customer.service';

@Component({
  selector: 'app-customer-management-setup',
  templateUrl: './customer-management-setup.component.html',
  styles: []
})
export class CustomerManagementSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  customerObj: Icustomer;
  modalForm: FormGroup;
  isRecordLoading: boolean = false;

  constructor(
    private toastrService: ToastrService,
    private helperService: HelperService,
    private accountService: AccountService,
    private CustomerService: CustomerService,
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
        customerName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
        normalizedEmail: ['', [Validators.required,Validators.email]],
        emailConfirmed: [true],
        phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        phoneNumberConfirmed: [true]
      });
    }
    else{
      this.isRecordLoading = true;
      this.CustomerService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data => {
        this.modalForm = this.formBuilder.group({
          isActive: [!data.isActive],
          customerName: [data.customerName, [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
          normalizedEmail: [data.normalizedEmail, [Validators.required, Validators.email]],
          emailConfirmed: [true],
          phoneNumber: [data.phoneNumber, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          phoneNumberConfirmed: [true]
        })
      });
    }
  }

  deleteRecord(){
    Promise.resolve().then(async() => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.CustomerService.delete(this.modalPopupObj.recordId).subscribe();
        this.modalPopupService.closeOrGoToPreviousModalPopup();
      }
    }).catch((error) => {
      console.warn("The given record could not be deleted!");
			console.error(error);
    });
  }

  submitForm(){
    if(!this.modalForm.valid){
      this.toastrService.error('Please add the Customer first');
      return;
    }

    const user = this.accountService.getCurrentUserValue();
    this.customerObj = {
      id: this.modalPopupObj.recordId,
      customerName: this.modalForm.controls['customerName'].value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      normalizedEmail: this.modalForm.controls['normalizedEmail'].value,
      emailConfirmed: true,
      phoneNumber: this.modalForm.controls['phoneNumber'].value,
      phoneNumberConfirmed: true,
      createdOn: this.helperService.getNowUTC(),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
    }

    if(this.modalPopupObj.isNewEntry){
      this.CustomerService.create(this.customerObj).subscribe();
    }
    else{
      this.CustomerService.update(this.customerObj).subscribe();
    }

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }

}
