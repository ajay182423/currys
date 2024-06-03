import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'common_modules/services/helper.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { IAuditParameterForm, IAuditParameterFormPost,IAuditParameterFormPut  } from 'projects/smart-assist/src/app/interfaces/settings/audit-parameter-form';
import { AuditParameterFormService } from 'projects/smart-assist/src/app/services/settings/audit-parameter-form.service';
import { AuditParameterService } from 'projects/smart-assist/src/app/services/settings/audit-parameter.service';
import { ProcessService } from 'projects/smart-assist/src/app/services/settings/process.service';
import { SectionService } from 'projects/smart-assist/src/app/services/settings/section.service';
import { AppUserService } from 'projects/smart-assist/src/app/services/settings/app-user.service'

@Component({
  selector: 'app-audit-parameter-form-setup',
  templateUrl: './audit-parameter-form-setup.component.html',
  styles: []
})
export class AuditParameterFormSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  auditParameterFormObj: IAuditParameterForm;
  auditParameterFormObjPut: IAuditParameterFormPut;
  auditParameterFormObjPost: IAuditParameterFormPost;
  modalForm: FormGroup;
  isRecordLoading: boolean = false;
  processList: any;
  parameterList: any;
  sectionList:any;
  userList: any;
  allParameterChecked = false;
  sectionSelected:boolean = false;
  isListLoading:boolean = false;
  totalParameterChecked = 0;


  constructor(
    private toastrService: ToastrService,
    private helperService: HelperService,
    private accountService: AccountService,
    private ProcessService : ProcessService,
    private sectionService : SectionService,
    private AuditParameterFormService: AuditParameterFormService,
    private AuditParameterService: AuditParameterService,
    private modalPopupService: ModalPopupService,
    private AppUserService: AppUserService,
    private confirmDialogService: ConfirmDialogService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.ProcessService.getProcessListById().subscribe(data => this.processList = data);
    this.sectionService.GetAllSection().subscribe(data => this.sectionList = data);
    this.AppUserService.getListOfAllUsers().subscribe(data => this.userList = data);
    this.fillModalPopupWithData(this.modalPopupObj);
  }

  parameterBySection(Selectedsection){
    this.sectionSelected = true;
    this.isListLoading = true;
    this.AuditParameterService.getListOfAllParameterBySection(Selectedsection).subscribe(data =>{
      this.parameterList = data;
      this.isListLoading = false;
    });
  }
  checkAllParameter(){
    this.allParameterChecked = !this.allParameterChecked;
    this.parameterList.forEach(e=>{
      e.isSelected = this.allParameterChecked;
    })
  }
  checkSingleParameter(item){
    item.isSelected = !item.isSelected;
    if(item.isSelected){
      this.totalParameterChecked += 1;
    }else{
      this.totalParameterChecked -= 1;
    }
    if(this.totalParameterChecked === this.parameterList.length && this.parameterList.length > 0){
      this.allParameterChecked = true;
    }else{
      this.allParameterChecked = false;
    }
  }
  fillModalPopupWithData(modalPopupObj:any){
    const user = this.accountService.getCurrentUserValue();
    if(modalPopupObj.isNewEntry){
      this.modalForm = this.formBuilder.group({
        isActive: [false],
        processId: [''],
        sectionId: [''],
        assignedTo: [''],
        QAname:[''],
        maxScore: ['']
      })
    }
    else{
      this.isRecordLoading = true;
      this.AuditParameterFormService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data =>{
        console.log(data);
        this.modalForm = this.formBuilder.group({
          isActive: [!data.isActive],
          processId: [data.processId],
          // sectionId:[],
          assignedTo: [data.assignedTo],
          QAname: [data.qa],
          maxScore: [data.maxScore]
        })
      })
    }
  }

  requiredCheckOnSelectInput(dropDownName:string, dropDownValue:string ){
    if(dropDownName == 'processSetup' ){
      this.modalForm.controls.processId.setValue(dropDownValue);
    }
    if(dropDownName == 'QaSetup' ){
      this.modalForm.controls.QAname.setValue(dropDownValue);
    }
    if(dropDownName == 'sectionSetup' ){
      this.modalForm.controls.sectionId.setValue(dropDownValue);
    }
    if(dropDownName == 'assignedToSetup' ){
      this.modalForm.controls.assignedTo.setValue(dropDownValue);
    }
  }
  deleteRecord(){
    Promise.resolve().then(async() => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.AuditParameterFormService.delete(this.modalPopupObj.recordId).subscribe();
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
    this.auditParameterFormObj = {
      formId: 1,
      processId: this.modalForm.controls.processId.value,
      id: this.modalPopupObj.recordId,
      qa: this.modalForm.controls['QA'].value,
      assignedTo: this.modalForm.controls['assignedTo'].value,
      auditParameterId: this.modalForm.controls.parameterId.value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      maxScore: this.modalForm.controls['maxScore'].value,
      createdDate: this.helperService.getNowUTC(),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
    }
    this.auditParameterFormObjPost = {
      formId :1,
      processId: this.modalForm.controls.processId.value,
      qa: this.modalForm.controls['QA'].value,
      assignedTo: this.modalForm.controls['assignedTo'].value,
      parameter: [
        {
          auditParameterId: 1,
          maxScore: 5,
          isActive: true,
        }
      ],
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
    }

    // if(this.modalPopupObj.isNewEntry){
    //   this.AuditParameterFormService.create(this.auditParameterFormObj).subscribe();
    // }
    // else{
    //   this.AuditParameterFormService.update(this.auditParameterFormObj).subscribe();
    // }

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }
}
