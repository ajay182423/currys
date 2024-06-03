import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalPopupService } from '../../../services/modal-popup.service__';
import { EntityPopupComponent } from '../../live-call-audit/entityPopup/entity-popup.component';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';

@Component({
  selector: 'app-call-transcript-new',
  templateUrl: './call-transcript-new.component.html',
  styleUrls: ['./call-transcript-new.component.scss']
})
export class CallTranscriptNewComponent implements OnInit {

  @ViewChild('containerElement', { static: false }) containerElement: ElementRef;

  @Input() transcriptData = [];

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective)
  directiveRef?: PerfectScrollbarDirective;
  public type: string = 'directive';

  callInfoShow: boolean;
  callHistoryShow: boolean;
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
  customerInfoForm: FormGroup;
  contactInfoForm: FormGroup;
  travelInfoForm: FormGroup;
  bookingSelectionForm: FormGroup;
  VulSign: string = 'No';
  eodCheck: boolean;

  constructor(
    private CallAuditService: CallAuditService,
    private modalPopupService: ModalPopupService,
    private toastrService: ToastrService,
  ) {  }


  ngOnInit(): void {
    this.localStorageCheck();
    this.getTranscriptData();

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.transcriptData?.previousValue?.length != changes.transcriptData?.currentValue?.length) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
        // console.log("changes");
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  toggleAgentTranscript() {
    this.isShowAgentTranscript = !this.isShowAgentTranscript;
  }

  getTranscriptData() {

    this.CallAuditService.transScriptData$.subscribe(data => {
      // console.log(data);
      if(data != null && data.length > 0) {
        if (data[data.length-1].vulnerability.result == 'vulnerable') {
          // this.driverData = data[data.length-1];
          // this.vulnerability_Data.push(data[data.length-1])
          this.VulSign = data[data.length-1].vulnerability.result == "vulnerable" ? 'Yes' : 'No';
          this.eodCheck = data.filter(f => f.EOD !='').length > 0;
          return
        }
      }
    })
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom(0, 500);
    }
  }

  localStorageCheck(){
    localStorage.removeItem('lastTime1');
    localStorage.removeItem('lastTime2');
    localStorage.removeItem('lastTime3');
    localStorage.removeItem('lastTime4');

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

  openEntityPopup(obj){
    this.modalPopupService.openModalPopup({
      openPopup: true,
      // recordId: recordId,
      recordObj : obj,
      isNewEntry: false,
      popupPosition: 'center',
      heading: 'Edit Entity Details',
      width: '60rem',
      height: '40rem',
      popup:  EntityPopupComponent
    });
  }
  entityVerified() {
    this.toastrService.info('Your feedback has been recorded');
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




  like(post:any){
    post.liked = !post.liked;
  }
  post = {
    content: 'This is my post content',
    likes: 0,
    liked: false
  };

  copyContent(content) {
    let entity = content.entity + ":" + content.text
    navigator.clipboard.writeText(entity);
    this.toastrService.info("Content Copied");
    // this.copiedText = 'Copied';
    // setTimeout(() => {
    //   this.copiedText = '';
    // }, 1000);
  }
}
