import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'common_modules/services/helper.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { IAuditParameter } from 'projects/smart-assist/src/app/interfaces/settings/audit-parameter';
import { AuditParameterService } from 'projects/smart-assist/src/app/services/settings/audit-parameter.service';
import { SectionService } from 'projects/smart-assist/src/app/services/settings/section.service';



@Component({
  selector: 'app-audit-parameter-setup',
  templateUrl: './audit-parameter-setup.component.html',
  styles: []
})
export class AuditParameterSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  auditParameterObj: IAuditParameter;
  modalForm: FormGroup;
  isRecordLoading: boolean = false;
  id: number ;
  isListLoading = false;
  sectionsList: any;
  parentParameterList: any;

  constructor(
    private toastrService: ToastrService,
    private helperService: HelperService,
    private accountService: AccountService,
    private sectionService : SectionService,
    private AuditParameterService: AuditParameterService,
    private modalPopupService: ModalPopupService,
    private confirmDialogService: ConfirmDialogService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fillModalPopupWithData(this.modalPopupObj);
    this.sectionService.GetListofAllSection().subscribe(data => this.sectionsList = data);
    this.AuditParameterService.GetListofAllParentParameter().subscribe(data => this.parentParameterList = data);
  }

  fillModalPopupWithData(modalPopupObj: any){
    if(modalPopupObj.isNewEntry){
      this.modalForm = this.formBuilder.group({
        isActive: [false],
        sectionId : ['', Validators.required],
        parameter : ['', Validators.required],
        helpText: ['', Validators.required],
        maxScore: ['', Validators.required],
        parentParameterId: [''],
      });
      this.sectionService.GetListofAllSection()
        .pipe(finalize(() => this.isListLoading = false)).subscribe(data => this.sectionsList = data);
      this.AuditParameterService.GetListofAllParentParameter()
        .pipe(finalize(() => this.isListLoading = false)).subscribe(data => this.parentParameterList = data);
    }
    else{
      this.isRecordLoading = true;
      this.AuditParameterService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data => {
        this.modalForm = this.formBuilder.group({
          isActive: [!data.isActive],
          sectionId : [data.sectionId, [Validators.required]],
          maxScore: [data.maxScore, [Validators.required]],
          parameter: [data.parameter, [Validators.required]],
          helpText: [data.helpText, [Validators.required]],
          parentParameterId: [data.parentParameterId]
        })
      });
    }
  }
  requiredCheckOnSelectInput(dropDownName:string, dropDownValue:string ){
    if(dropDownName == 'parentParameterSetup' ){
      this.modalForm.controls.parentParameterId.setValue(dropDownValue);
    }
    if(dropDownName == 'sectionSetup' ){
      this.modalForm.controls.sectionId.setValue(dropDownValue);
    }

  }

  deleteRecord(){
    Promise.resolve().then(async() => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.AuditParameterService.delete(this.modalPopupObj.recordId).subscribe();
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
    this.auditParameterObj = {
      id: this.modalPopupObj.recordId,
      sectionId: this.modalForm.controls.sectionId.value,
      parameter: this.modalForm.controls['parameter'].value,
      // parentParameterId: this.modalForm.controls.parentParameterId.value,
      parentParameterId: 0,
      maxScore: this.modalForm.controls['maxScore'].value,
      helpText: this.modalForm.controls['helpText'].value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      createdOn: this.helperService.getNowUTC(),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
    }

    if(this.modalPopupObj.isNewEntry){
      this.AuditParameterService.create(this.auditParameterObj).subscribe();
    }
    else{
      this.AuditParameterService.update(this.auditParameterObj).subscribe();
    }

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }

}
