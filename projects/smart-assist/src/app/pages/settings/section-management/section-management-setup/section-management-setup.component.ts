import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'common_modules/services/helper.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { SectionService } from 'projects/smart-assist/src/app/services/settings/section.service';
import { ISection } from '../../../../interfaces/settings/section';
import { AuditParameterTypeService } from 'projects/smart-assist/src/app/services/settings/audit-parameter-type.service'

@Component({
  selector: 'app-section-management-setup',
  templateUrl: './section-management-setup.component.html',
  styles: [`.checkbox{ display: flex; gap: 10px }`]
})
export class SectionManagementSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  sectionObj: ISection;
  modalForm: FormGroup;
  isRecordLoading: boolean = false;
  isColumnRequiredList: any[] = [];
  isChecked:boolean;
  checkedColumn:any;

  constructor(
    private toastrService: ToastrService,
    private helperService: HelperService,
    private accountService: AccountService,
    private SectionService: SectionService,
    private AuditParameterTypeService: AuditParameterTypeService,
    private modalPopupService: ModalPopupService,
    private confirmDialogService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.fillModalPopupWithData(this.modalPopupObj);
  }

  fillModalPopupWithData(modalPopupObj: any){
    if(modalPopupObj.isNewEntry){
      this.AuditParameterTypeService.isColumnRequiredList().subscribe((d:any )=> {
        d.forEach(e => this.isColumnRequiredList.push({id:e.id,parameterName:e.parameterName}));
      });
      this.modalForm = new FormGroup({
        isActive: new FormControl(false),
        isConsildatedResult: new FormControl(false),
        section: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]),
        weightage: new FormControl('', [Validators.required]),
        isColumnRequired: new FormArray([], [Validators.required])
      })
    }
    else{
      this.isRecordLoading = true;
      this.SectionService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe((data:any) => {
        let da = data.sections;
        this.modalForm = new FormGroup({
          isActive: new FormControl(!da.isActive),
          isConsildatedResult: new FormControl(!da.isConsildatedResult),
          section: new FormControl(da.section,[Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]),
          weightage: new FormControl(da.weightage, [Validators.required]),
          isColumnRequired: new FormArray([],[Validators.required])
        })
        this.isColumnRequired(da.isColumnRequired, data.columnRequired);
      });
    }
  }

  isColumnRequired(isColumnRequired, columnName):any{
    let requiredColumn = isColumnRequired.split(',');
    this.checkedColumn = this.modalForm.get('isColumnRequired') as FormArray;
    columnName.forEach((e,i) =>{
      this.isColumnRequiredList.push({id:e.id,parameterName:e.parameterName})
      if(e.id == requiredColumn[i]){
        this.checkedColumn.push(new FormControl(e.id))
        this.isChecked = true;
      }
    })
  }
  onColumnRequiredChange(e:any){
    let checkedValue = e.target.value;
    let checked = e.target.checked;
    this.checkedColumn = this.modalForm.get('isColumnRequired') as FormArray;
    if(this.modalPopupObj.isNewEntry){
      if(checked){
        this.checkedColumn.push(new FormControl(checkedValue));
      }else{
        let i = 0;
        this.checkedColumn.controls.forEach(item =>{
          if(item.value == checkedValue)this.checkedColumn.removeAt(i);
          i++;
        })
      }
    }else{
      if(checked){
        this.checkedColumn.push(new FormControl(checkedValue));
      }else{
        let i = 0;
        this.checkedColumn.controls.forEach(item =>{
          if(item.value == checkedValue)this.checkedColumn.removeAt(i);
          i++;
        })
      }
    }
  }

  deleteRecord(){
    Promise.resolve().then(async() => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.SectionService.delete(this.modalPopupObj.recordId).subscribe();
        this.modalPopupService.closeOrGoToPreviousModalPopup();
      }
    }).catch((error) => {
      console.warn("The given record could not be deleted!");
			console.error(error);
    });
  }

  submitForm(){
    if(!this.modalForm.valid){
      this.toastrService.error('Please add the section first');
      return;
    }
    const user = this.accountService.getCurrentUserValue();
    this.sectionObj = {
      id: this.modalPopupObj.recordId,
      section: this.modalForm.controls['section'].value,
      weightage: this.modalForm.controls['weightage'].value,
      isActive: !JSON.parse(this.modalForm.controls['isActive'].value),
      isConsildatedResult: false,
      isColumnRequired: (this.checkedColumn.value).join(),
      updatedBy: user.firstName + " " + user.lastName + " (" + user.userName + ")",
      updatedOn: this.helperService.getNowUTC(),
      createdOn: this.helperService.getNowUTC(),
    }

    if(this.modalPopupObj.isNewEntry){
      this.SectionService.create(this.sectionObj).subscribe();
    }
    else{
      this.SectionService.update(this.sectionObj).subscribe();
    }

    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }

}
