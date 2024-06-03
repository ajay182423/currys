import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { Subscription } from 'rxjs';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { CenterPopupService } from 'common_modules/services/center-popup.service';
import { EntityPopupNewComponent } from '../../entity-popup-new/entity-popup-new.component';

@Component({
  selector: 'app-ai-entity-extract-new',
  templateUrl: './ai-entity-extract-new.component.html',
  styleUrls: ['./ai-entity-extract-new.component.scss']
})
export class AIEntityExtractNewComponent implements OnInit, OnDestroy {

  @ViewChild('containerElement', { static: false }) containerElement: ElementRef;

  transcriptData = [];
  transcriptDataentities = [];

  imgFileUrl = environment.imgFilesUrl

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective)
  directiveRef?: PerfectScrollbarDirective;
  public type: string = 'directive';

  recommendationShow: boolean;
  extracted_detailsShow: boolean;
  actionShow: boolean;
  knowledgeShow: boolean;
  call_wrapShow: boolean;
  copiedText: string = '';
  subscription: Subscription

  isShowAgentTranscript:boolean = true;
  iscallTranscript:boolean;
  isProceduralGuidance: boolean;
  isCallSummary: boolean;
  isExtractedDetails: boolean;
  isLiveFeedback: boolean;
  isSentiments: boolean;
  isLiveAudit: boolean;
  callSummary:any[] = [];
  responseData: any[] = [];
  customerInfoForm: FormGroup;
  contactInfoForm: FormGroup;
  travelInfoForm: FormGroup;
  bookingSelectionForm: FormGroup;
  customerExtractedDetailsShow: boolean;
  customerExtractedDriverShow: boolean;
  customerExtractedGraphShow: boolean;
  customerExtractedLiveAuditShow: boolean;
  lastTimeRecord1: number;
  lastTimeRecord2: number;
  lastTimeRecord3: number;
  lastTimeRecord4: number;
  lastTimeRecord6: number;
  lastTimeRecord7: number;
  detailsNotificationCount: number = 0;
  driverNotificationCount: number = 0;
  actionNotificationCount: number = 0;
  pgtNotificationCount: number = 0;
  callWrapNotificationCount: number = 0;
  graphNotificationCount: number = 0;
  liveAuditNotificationCount: number = 0;
  copyContentBtn: boolean[] = new Array(this.transcriptDataentities.length).fill(false);
  liveAuditData: any = [];
  modalForm: FormGroup;
  isLoading: boolean;
  questionText: any;
  callWrapForm: FormGroup;
  loremIpsum = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus, libero? Ut maxime soluta porro tempora modi perferendis tempore doloribus inventore amet!'
  call_summary: any;
  callIntent: any;
  objectKeys = Object.keys;

  constructor(
    private formBuilder: FormBuilder,
    private CallAuditService: CallAuditService,
    private modalPopupService: ModalPopupService,
    private toastrService: ToastrService,
    private centerPopupService: CenterPopupService,
  ) {
    this.showAITabs('recommendation');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
      question: ['', [Validators.required]],
    });
    this.CallAuditService.transScriptData$.subscribe((res) => {
      // console.log(res)
      this.transcriptData = res;
      this.callIntent = res?.filter(f => f.intent_data != '')[0]?.intent_data[0];
      // console.log(this.callIntent);
      if(this.callIntent != null && this.callIntent != undefined) {
          this.callIntent = this.callIntent.value[0]?.name
      }

      this.call_summary =  this.transcriptData?.filter(f => f?.Call_summary != '')[0]?.Call_summary.split("\\n");
      // console.log(this.call_summary);
      if(this.call_summary?.length > 1) {
        if(this.transcriptData[this.transcriptData?.length-1]?.Call_summary.length > 0){
          this.callWrapForm = this.formBuilder.group({
            call_description: [{value: this.call_summary ? this.call_summary[1] : '', disabled: true}],
            call_action: [{value: this.call_summary ? this.call_summary[3] : '', disabled: true}],
            call_outcome: [{value: this.call_summary ? this.call_summary[5] : '', disabled: true}],
          });
        }
      }
      else { 
          this.callWrapForm?.reset(); 
      }
      if(res != null) {
        if(res.length > 0) {
          if(this.recommendationShow == true) {
            this.detailsNotificationCount = 0
            this.lastTimeRecord1 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
            res[res.length-1].end_time.split(':')[1],
            res[res.length-1].end_time.split(':')[2]);
            localStorage.setItem('lastTime1', this.lastTimeRecord1.toString());
          }
          if(this.recommendationShow == false) {
            this.detailsNotificationCount = res.filter(f => (f.entities != ' ' || f.Feedback != '' || f.actions != '') && (this.convertToSeconds(f.end_time.split(':')[0],
              f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime1')))).length;
            }

          // if(this.recommendationShow == true) {
          //   this.driverNotificationCount = 0;
          //   this.lastTimeRecord2 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
          //   res[res.length-1].end_time.split(':')[1],
          //   res[res.length-1].end_time.split(':')[2]);
          //   localStorage.setItem('lastTime2', this.lastTimeRecord2.toString());
          // }
          // if(this.recommendationShow == false) {
          //   // this.driverNotificationCount = 0;
          //   this.driverNotificationCount = res.filter(f =>
          //     f.Feedback != ''  && this.convertToSeconds(f.end_time.split(':')[0],
          //     f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime2'))
          //   ).length
          // }
          // if(this.recommendationShow == true) {
          //   this.actionNotificationCount = 0;
          //   this.lastTimeRecord2 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
          //   res[res.length-1].end_time.split(':')[1],
          //   res[res.length-1].end_time.split(':')[2]);
          //   localStorage.setItem('lastTime5', this.lastTimeRecord2.toString());
          // }
          // if(this.recommendationShow == false) {
          //   // this.actionNotificationCount = 0;
          //   this.actionNotificationCount = res.filter(f =>
          //     f.action != ''  && this.convertToSeconds(f.end_time.split(':')[0],
          //     f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime5'))
          //   ).length
          // }
          if(this.knowledgeShow == true) {
            this.pgtNotificationCount = 0;
            this.lastTimeRecord6 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
            res[res.length-1].end_time.split(':')[1],
            res[res.length-1].end_time.split(':')[2]);
            localStorage.setItem('lastTime6', this.lastTimeRecord6.toString());
          }
          if(this.knowledgeShow == false) {
            // this.pgtNotificationCount = 0;
            this.pgtNotificationCount = res.filter(f =>
              f.Procedural_Guidance != ''  && this.convertToSeconds(f.end_time.split(':')[0],
              f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime6'))
            ).length
          }
          if(this.call_wrapShow == true) {
            this.callWrapNotificationCount = 0;
            this.lastTimeRecord7 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
            res[res.length-1].end_time.split(':')[1],
            res[res.length-1].end_time.split(':')[2]);
            localStorage.setItem('lastTime7', this.lastTimeRecord7.toString());
          }
          if(this.call_wrapShow == false) {
            // this.callWrapNotificationCount = 0;
            this.callWrapNotificationCount = res.filter(f =>
              f.Call_summary != ''  && this.convertToSeconds(f.end_time.split(':')[0],
              f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime7'))
            ).length

            this.callWrapNotificationCount > 1 ? this.callWrapNotificationCount = 1 : 0
          }

          if(this.customerExtractedGraphShow == true) {
            this.lastTimeRecord3 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
            res[res.length-1].end_time.split(':')[1],
            res[res.length-1].end_time.split(':')[2]);
            localStorage.setItem('lastTime3', this.lastTimeRecord3.toString());
          }
          if(this.customerExtractedGraphShow == false) {
            this.graphNotificationCount = res.slice(-20).filter(f => f.Sentiment < 0 && this.convertToSeconds(f.end_time.split(':')[0],
              f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime3'))).length;
            }

          if(this.customerExtractedLiveAuditShow == true) {
            this.lastTimeRecord4 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
            res[res.length-1].end_time.split(':')[1],
            res[res.length-1].end_time.split(':')[2]);
            localStorage.setItem('lastTime4', this.lastTimeRecord4.toString());
          }
          if(this.customerExtractedLiveAuditShow == false) {
            // console.log(this.liveAuditData)
            this.liveAuditNotificationCount = this.liveAuditData.filter(f =>
              f?.LiveAudit != undefined
              && this.convertToSeconds(f?.end_time.split(':')[0],
              f?.end_time.split(':')[1],f?.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime4'))).length;
            }
          }
        }

      this.scrollToBottom();

    })


    this.localStorageCheck();
  }
  callWrapEvent(){
    this.toastrService.info('Call Completed');
  }
  callWrapAndInitiateCaseEvent(){
    this.toastrService.info('Call Completed and Ticket Logged');
  }
  toggleAgentTranscript() {
    this.isShowAgentTranscript = !this.isShowAgentTranscript;
  }
  showAITabs(tabName:string){
    if (tabName === 'recommendation'){
        this.recommendationShow = true;
        this.extracted_detailsShow = false;
        this.actionShow = false;
        this.knowledgeShow = false;
        this.call_wrapShow = false;
        this.scrollToBottom();
        this.actionNotificationCount = 0;
    }
   else if (tabName === 'extracted_details'){
      this.recommendationShow = false;
      this.extracted_detailsShow = true;
      this.actionShow = false;
      this.knowledgeShow = false;
      this.call_wrapShow = false;
      this.scrollToBottom();
    }
   else if (tabName === 'action'){
      this.recommendationShow = false;
      this.extracted_detailsShow = false;
      this.actionShow = true;
      this.knowledgeShow = false;
      this.call_wrapShow = false;
      this.scrollToBottom();
    }
   else if (tabName === 'knowledge'){
      this.recommendationShow = false;
      this.extracted_detailsShow = false;
      this.actionShow = false;
      this.knowledgeShow = true;
      this.call_wrapShow = false;
      this.scrollToBottom();
      this.pgtNotificationCount = 0;
    }
   else if (tabName === 'call_wrap'){
      this.recommendationShow = false;
      this.extracted_detailsShow = false;
      this.actionShow = false;
      this.knowledgeShow = false;
      this.call_wrapShow = true;
      this.scrollToBottom();
      this.callWrapNotificationCount = 0;
    }
  }

  localStorageCheck(){
    localStorage.removeItem('lastTime1');
    localStorage.removeItem('lastTime2');
    localStorage.removeItem('lastTime3');
    localStorage.removeItem('lastTime4');
    localStorage.removeItem('lastTime5');
    localStorage.removeItem('lastTime6');
    localStorage.removeItem('lastTime7');

    if(!localStorage.getItem('issmart-assistcallTranscript')){
      localStorage.setItem('issmart-assistcallTranscript' , 'true')
    }
    if(!localStorage.getItem('issmart-assistProceduralGuidance')){
      localStorage.setItem('issmart-assistProceduralGuidance' , 'true')
    }
    if(!localStorage.getItem('issmart-assistCallSummary')){
      localStorage.setItem('issmart-assistCallSummary' , 'true')
    }
    if(!localStorage.getItem('issmart-assistExtractedDetails')){
      localStorage.setItem('isExtractedDetails' , 'true')
    }
    if(!localStorage.getItem('issmart-assistLiveFeedback')){
      localStorage.setItem('issmart-assistLiveFeedback' , 'true')
    }
    if(!localStorage.getItem('issmart-assistSentiments')){
      localStorage.setItem('issmart-assistSentiments' , 'true')
    }
    if(!localStorage.getItem('issmart-assistLiveAudit')){
      localStorage.setItem('issmart-assistLiveAudit' , 'true')
    }
    this.iscallTranscript = JSON.parse(localStorage.getItem('issmart-assistcallTranscript'))
    this.isProceduralGuidance = JSON.parse(localStorage.getItem('issmart-assistProceduralGuidance'))
    this.isCallSummary = JSON.parse(localStorage.getItem('issmart-assistCallSummary'))
    this.isExtractedDetails = JSON.parse(localStorage.getItem('issmart-assistExtractedDetails'))
    this.isLiveFeedback = JSON.parse(localStorage.getItem('issmart-assistLiveFeedback'))
    this.isSentiments = JSON.parse(localStorage.getItem('issmart-assistSentiments'))
    this.isLiveAudit = JSON.parse(localStorage.getItem('issmart-assistLiveAudit'))
  }
  convertToSeconds(hours, minutes, seconds){
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

  public onScrollEvent(event: any): void {
    // console.log(event);
  }

  autoScroll(){
    this.containerElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end',inline: "nearest" });
  }

  multiLine(text:string): boolean{
    return text.includes('\n');
  }
  checkForSplit(text:string){
    if(text.indexOf('\n')){
     return this.splitByNewLine(text)
    }else{
      return text;
    }
  }

  splitByNewLine(text: string): string[] {
    return text.split('\n');
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    }
  }



  like(post:any){
    post.liked = !post.liked;
  }
  post = {
    content: 'This is my post content',
    likes: 0,
    liked: false
  };

  openFeedbackPopup(obj:any, name:string){
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordObj : obj,
      isNewEntry: false,
      popupPosition: 'center',
      heading: name,//'Edit Entity Details',
      width: '53vh',
      height: '50vh',
      popup:  EntityPopupNewComponent
    });
  }

  openOthersPopup(obj:any){
    Promise.resolve().then(async () => {
      let c=await this.centerPopupService.openModalPopup({
        openPopup: true,
        recordObj : obj,
        isNewEntry: true,
        recordId:3,
        popupPosition: 'right',
        isPromise:true,
        heading: 'Add Others',
        width: '53vh',
        height: '50vh',
        previousPopup:false,
        popup: EntityPopupNewComponent
      })
      let othersData = JSON.stringify(c.othersData);
      this.modalForm.get('Others').patchValue(othersData);
    }).catch((error) => {
      console.error(error);
    });
  }
  entityVerified() {
    this.toastrService.info('Your feedback has been recorded');
  }
  saveEntity() {
    this.toastrService.info('Your changes has been saved');
  }
  callToActionEvent(action) {
    this.toastrService.info(action + ' Initiated Successfully');
  }

  copyContent(content) {
    let entity = content.entity + ":" + content.text
    navigator.clipboard.writeText(entity);
    this.toastrService.info("Content Copied");

    // this.copiedText = 'Copied';
    // setTimeout(() => {
    //   this.copiedText = '';
    // }, 1000);
  }

  submitForm() {
    // Shaowing loader while data comes
    this.isLoading = true;

    if(!this.modalForm.valid){
      this.toastrService.error('Please enter the question!');
      return;
    }

    // checking the form value exist
    // if(this.question.value) {

    // Assigning the question text
    this.questionText = this.modalForm.controls['question'].value
    console.log(this.questionText);

    // Calling the API by passing question
    this.CallAuditService.getProceduralData(this.questionText).subscribe(data => {
      console.log(data);
      let dataArray = {
        query : data.query,
        response : data.response,
        sources : data.sources
      }
      this.responseData.push(dataArray);
      // Hiding loader while data rendered
      this.isLoading = false;
    })
    this.modalForm.controls['question'].setValue('');

  }

  updateCallForm() {
    this.toastrService.success('Form submitted successfully');
  }

  recordFeedback(){
    this.toastrService.info('Your feedback has been recorded');
  }
  editDescription(){
    this.callWrapForm.controls['call_description'].enable();
    this.callWrapForm.controls['call_action'].enable();
    this.callWrapForm.controls['call_outcome'].enable();
  }

}
