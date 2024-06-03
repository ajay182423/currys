import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import WaveSurfer from 'wavesurfer.js';
import * as moment from 'moment';
import { FormBuilder,FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { HelpTextComponent } from './help-text/help-text.component';
import { ActivatedRoute } from '@angular/router';
import { IPostCallAudit } from '../../interfaces/pages/call-audit';
import { ICallAuditSection } from '../../interfaces/pages/call-audit-section';
import { ICallAuditResults } from '../../interfaces/pages/call-audit-results';
import { AuditParameterTypeService } from 'projects/smart-assist/src/app/services/settings/audit-parameter-type.service';
import { AuditStatusService } from 'projects/smart-assist/src/app/services/settings/audit-status.service';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service'
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';


@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.scss']
})
export class BackOfficeComponent implements OnInit {
  customForm: FormGroup[] = [];
  isLoading: boolean = false;
  modalForm: FormGroup;
  PostCallAuditObj: IPostCallAudit;
  callAuditObjSection: ICallAuditSection[] = [];
  callAuditObjResult: ICallAuditResults[] = [];
  isShowing: boolean = false;
  transactionId: string = '';
  auditData: any = [];
  maxSorePercentage: any = 0;
  scoreCalcTotalF: number;
  scorecalcu: number;
  maxscorecalcu: number;
  TransactionIdFromRoute: string;
  IdFromRoute: number;
  parameterResultData: any;
  sectionDataPost: any;
  showSubmitAudit: boolean = false;
  filterText: string = '';
  PCIcomment: string;
  resultList: any;
  isColumnRequiredList: any;
  agentName: any;
  audioLength: any;
  flaggedCall: string;
  flagDivShow : boolean = false;
  callResponse: string;
  queryResolved: string;
  customerIntent: string;
  agentDetailShow: boolean = false;
  sectionData: any;


  constructor(
    private formBuilder: FormBuilder,
    private CallAuditService: CallAuditService,
    private AuditParameterTypeService: AuditParameterTypeService,
    private AuditRecordsService: AuditRecordsService,
    private AuditStatusService: AuditStatusService,
    private modalPopupService: ModalPopupService,
    private accountService: AccountService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.TransactionIdFromRoute = params['transactionId'];
      this.IdFromRoute = params['ID'];
      this.modalForm = this.formBuilder.group({
        transaction: [{ value: this.TransactionIdFromRoute, disabled: false }]
      });
      this.getAudit();
    });
  }

  //param to save static data section, weightage, parameter
  sectionsData: {
    sectionName: string;
    weightage: number;
    IDVoutcome: string;
    PCIoutcome: string;
    parameters: {
      parameterIndex: number;
      parameterName: string;
      parameterHelpText: string;
    }[];
  }[] = [];
  //Get audit method to create forms and fill data in sectionsData variable
  getAudit() {
    this.maxSorePercentage = 0;
    this.scorecalcu = 0;
    this.maxscorecalcu = 0;
    this.transactionId = this.modalForm.controls['transaction'].value;
    if (!this.transactionId) {
      this.toastrService.error("Please Enter The Transation Id First")
      return;
    } else {
      this.CallAuditService.getRecord(this.transactionId).subscribe((data) => {
        this.sectionData = data;
        this.AuditParameterTypeService.isColumnRequiredList().subscribe(d => {
          this.isColumnRequiredList = d
        });
        this.AuditStatusService.resultList().subscribe(result =>{
          this.resultList = result.map(m => ({
            id: m.status,
            name: m.status,
          }))
        });
        let i = 0;
        data?.sections?.forEach((section) => {
          let sectionData: any = {
            sectionName: section.section,
            weightage: section.weightage,
            IDVoutcome: 'Fail',
            PCIoutcome: '',
            comments: '',
            parameters: [],
          };
          //declare total score var for sctions
          let totalScoreOfSectionShouldBe = 0;
          let totalScoreOfSectionAchieved = 0;
          let len = section?.results?.length;
          section?.results?.forEach((paramResult) => {
            //add param score to total score var
            if (paramResult.auditParameterId == 43) {
              if (i < len - 1) {
                totalScoreOfSectionShouldBe =
                  totalScoreOfSectionShouldBe + paramResult.maxScore;
                totalScoreOfSectionAchieved =
                  totalScoreOfSectionAchieved + paramResult.score;
                sectionData.parameters.push({
                  parameterIndex: i,
                  parameterName: paramResult.parameter,
                  parameterHelpText: paramResult.helpText,
                  auditResult: paramResult.auditResult,
                });
              }
            } else {
              totalScoreOfSectionShouldBe =
                totalScoreOfSectionShouldBe + paramResult.maxScore;
              totalScoreOfSectionAchieved =
                totalScoreOfSectionAchieved + paramResult.score;
              sectionData.parameters.push({
                parameterIndex: i,
                parameterName: paramResult.parameter,
                parameterHelpText: paramResult.helpText,
                auditResult: paramResult.auditResult,
              });
            }
            this.customForm[i] = this.formBuilder.group({
              result: [paramResult.auditResult],
              score: [paramResult.score],
              confidence: [{ value: paramResult.confidence, disabled: true }],
              fatal: [paramResult.fatal],
              AssociatedTranscript: [this.remarkStringFill(paramResult)],
            });
            //PCI Complience all logic
            if (paramResult.auditParameterId == 43) {
              if (paramResult.auditResult == 'Yes')
                sectionData.PCIoutcome = 'Passed';
              if (paramResult.auditResult == 'No')
                sectionData.PCIoutcome = 'Fail';
              if (paramResult.auditResult == 'Exception')
                sectionData.PCIoutcome = 'Exception';
            }
            //score and Perceantage Calulation
            this.scorecalcu = paramResult.score + this.scorecalcu;
            this.maxscorecalcu = this.maxscorecalcu + paramResult.maxScore;
            this.maxSorePercentage =
              this.maxSorePercentage + paramResult.maxScore;
            this.scoreCalcTotalF = Math.round(
              (this.scorecalcu / this.maxSorePercentage) * 100
            );
            i = i + 1;
          });
          if (totalScoreOfSectionShouldBe == totalScoreOfSectionAchieved)
            sectionData.IDVoutcome = 'Passed';
          if (
            totalScoreOfSectionAchieved > 0 &&
            totalScoreOfSectionAchieved < totalScoreOfSectionShouldBe
          )
            sectionData.IDVoutcome = 'Exception';
          if (sectionData.IDVoutcome === 'Fail')
            sectionData.comments = 'No checks completed';
          if (sectionData.IDVoutcome === 'Passed')
            sectionData.comments = 'All checks completed';
          if (sectionData.IDVoutcome === 'Exception')
            sectionData.comments = 'Less than 3 checks completed';
          this.sectionsData.push(sectionData);
          this.showSubmitAudit = true;
        });
        this.modalForm.controls['transaction'].disable();
        this.flagDivShow = true;
      });
      this.agentDetails();
    }
  }
  agentDetails(){
    this.AuditRecordsService.getRecord(this.transactionId).subscribe(da =>{
      console.log(da);
      this.agentName = da.agentName;
      this.callResponse = da.callResponse;
      this.queryResolved = da.queryResolved;
      this.customerIntent = da.workGroup;
      this.flaggedCall = da.flag;
      this.agentDetailShow = true;
    })
  }
  flagThisCall(){
    const flag = {
      flag: 'flagged'
    }
    Promise.resolve().then(async() => {
      if(await this.confirmDialogService.openFlagConfirmDialog('Flag call', 'Are you sure you want to permanently flag this call?')){
        this.AuditRecordsService.flaggedCall(flag ,this.transactionId).subscribe()
        this.toastrService.success('Call Flagged Successfully, Refreshing...');
        this.ngOnInit();
      }
    }).catch((error) => {
      console.warn("The given call could not be flagged, Please try again!");
			console.error(error);
    });
  }
  remarkStringFill(paramResult: any) {
    let returnResult: any = '';
    if(paramResult.remarks == ''){
      paramResult?.otherProperties?.forEach((others) => {
        returnResult += others.comment +'\n';
      });
    }else{
      returnResult = paramResult.remarks;
    }
    return returnResult;
  }

  openHelpText(val: any) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: val,
      popupPosition: 'centre',
      heading: 'Help Text',
      width: '60rem',
      height: '70rem',
      popup: HelpTextComponent,
    });
  }
  submitAudit() {
    const user = this.accountService.getCurrentUserValue();
    this.callAuditObjSection = [];
    let k = -1;
    this.sectionData.sections.forEach((e) => {
      this.callAuditObjSection.push(
        {
          sectionId: e.sectionId,
          section: e.section,
          weightage: e.weightage,
          results: e.results.map((element) => {
            k++;
            return{
                auditParameterId: element.auditParameterId,
                score: this.customForm[k].controls['score'].value,
                auditResult: this.customForm[k].controls['result'].value,
                confidence: element.confidence,
                fatal: element.fatal,
                remarks: this.customForm[k].controls['AssociatedTranscript'].value,
            };
          })
        }
      );
    });
    this.PostCallAuditObj = {
      processId: this.sectionData.processId,
      formId: this.sectionData.formId,
      assignedTo: this.sectionData.assignedTo,
      qa: user.firstName + ' ' + user.lastName + ' (' + user.userName + ')',
      transactionId: this.sectionData.transactionId,
      sections: this.callAuditObjSection,
    };
    this.CallAuditService.submitAudit(this.PostCallAuditObj).subscribe(data => {
      console.log(data)
      this.toastrService.success('Audit Updated Suceessfully');
    })
  }




}
