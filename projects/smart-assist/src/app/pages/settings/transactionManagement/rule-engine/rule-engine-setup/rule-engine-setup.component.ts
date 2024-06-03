import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { HelperService } from 'common_modules/services/helper.service';
import { finalize } from 'rxjs/operators';
import { UserGroupService } from 'projects/smart-assist/src/app/services/settings/user-group.service';

@Component({
  selector: 'app-rule-engine-setup',
  templateUrl: './rule-engine-setup.component.html',
  styles: []
})
export class RuleEngineSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  modalForm: FormGroup;
  isRecordLoading = false;
    isListLoading = false;
    reconSetupSelectError = false;
    dataSourceSelectError = false;
    tableLHSSelectError = false;
    tableRHSSelectError = false;
    matchColumnLHSSelectError = false;
    conditionSelectError = false;
    matchColumnRHSSelectError = false;
    columnLHSSumSelectError = false;
    columnRHSSumSelectError = false;
    appCompanyList: any;
    appRegionList: any;
    appAccountList: any;
    appDataSourceList: any;
    appReconNamesList: any;
    ruleExpressionValue = '';
    tableLHSSourceList: any;
    matchcolumnLHSSourceList: any;
    matchColumnRHSSourceList: any;
    tableRHSSourceList: any;
  accountService: any;
  userGroupObj: { id: any; name: any; isActive: boolean; updatedBy: string; updatedOn: Date; totalUsers: number; };


  constructor(
    private helperService: HelperService,
    private confirmDialogService: ConfirmDialogService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private modalPopupService: ModalPopupService,
    private userGroupService: UserGroupService,
  ) { }

  ngOnInit(): void {
    this.fillModalPopupWithData(this.modalPopupObj);
  }

  fillModalPopupWithData(modalPopupObj: any){
    if (modalPopupObj.isNewEntry){
      this.modalForm = this.formBuilder.group({
        isActive: [false],
        rhsManually: [false],
        id: [''],
        name: ['', [Validators.required]],
        dataSource: ['', [Validators.required]],
        dataSource2: ['', [Validators.required]],
        tableLHS: ['', [Validators.required]],
        tableRHS: ['', [Validators.required]],
        sumColumnLHS: ['', [Validators.required]],
        sumColumnRHS: ['', [Validators.required]],
        matchColumnLHS: [''],
        matchColumnRHS: [''],
        condition: [''],
        ruleExpression: ['', [Validators.required]],
      });
      // get accesses list
      this.isListLoading = true;
      // this.businessRulesService.GetCompanyNamesForReconSetup().pipe(finalize(() => this.isListLoading = false))
      //  .subscribe(data => this.appCompanyList = data);
      // this.businessRulesService.GetAccountNamesForReconSetup().pipe(finalize(() => this.isListLoading = false))
      //  .subscribe(data => this.appAccountList = data);
      // this.vendorService.GetRegionNamesForLOBSetup().pipe(finalize(() => this.isListLoading = false))
      //   .subscribe(data => this.appRegionList = data);
    }
    else{
      this.isRecordLoading = true;
      this.userGroupService.getRecord(modalPopupObj.recordId).pipe(finalize(() => this.isRecordLoading = false)).subscribe(data => {
        this.modalForm = this.formBuilder.group({
          isActive: [!data.isActive],
          rhsManually: [''],
          id: [data.id],
          name: [data.name, [Validators.required, Validators.pattern('^[a-zA-Z0-9\.\\\\\,\&\(\)\ \_\/\-]*$')]],
          matchColumnLHS: [''],
          matchColumnRHS: [''],
          // tableLHS: [data.tableSourceLHS, [Validators.required]],
          // tableRHS: [data.tableSourceRHS, [Validators.required]],
          // sumColumnLHS: [data.sumColumnLHS, [Validators.required]],
          // sumColumnRHS: [data.sumColumnRHS, [Validators.required]],
          // dataSource: [data.dataSource, [Validators.required]],
          // dataSource2: [data.dataSource2, [Validators.required]],

          // reconName: [data.reconName, [Validators.required]],
          condition: [''],
          // ruleExpression: [ data.ruleExpression, [Validators.required]],
        });
      });
    }
  }

  deleteRecord(){
    Promise.resolve().then( async () => {
      if (await this.confirmDialogService.openConfirmDialog('Delete record', 'Are you sure you want to permanently delete this record?')) {
        this.userGroupService.delete(this.modalPopupObj.recordId).subscribe();
        this.modalPopupService.closeModalPopup();
      }
    }).catch((error) => {
      console.warn('The given record could not be deleted!');
      console.error(error);
    });
  }

  submitForm(){
    if(!this.modalForm.valid){
      this.toastrService.error('Please add the Rule first');
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
