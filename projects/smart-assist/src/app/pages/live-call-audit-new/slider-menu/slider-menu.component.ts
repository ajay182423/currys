import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CenterPopupService } from 'common_modules/services/center-popup.service';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { Subscription } from 'rxjs';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';

@Component({
  selector: 'app-slider-menu',
  templateUrl: './slider-menu.component.html',
  styleUrls: ['./slider-menu.component.scss']
})
export class SliderMenuComponent implements OnInit {

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

  isShowAgentTranscript: boolean = true;
  iscallTranscript: boolean;
  isProceduralGuidance: boolean;
  isCallSummary: boolean;
  isExtractedDetails: boolean;
  isLiveFeedback: boolean;
  isSentiments: boolean;
  isLiveAudit: boolean;
  callSummary: any[] = [];
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
  latesttranscript: any;
  PreviousTimeStamp: any;
  feedbackData: any[] = [];
  isVisible: boolean = false;
  shownData = []

  constructor(
    private formBuilder: FormBuilder,
    private CallAuditService: CallAuditService,
    private modalPopupService: ModalPopupService,
    private toastr: ToastrService,
    private centerPopupService: CenterPopupService,
  ) {

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
      question: ['', [Validators.required]],
    });
    this.CallAuditService.transScriptData$.subscribe((res: any[]) => {
      // console.log(res)
      this.transcriptData = res;
      this.feedbackData = this.transcriptData?.filter(f => f?.Feedback && f.Feedback.length > 0);

      this.feedbackData?.forEach(data => {
        if (data && data.Feedback && data.Feedback[0] && data.Feedback[0].text && !this.shownData.includes(data.Feedback[0].text)) {
          this.isVisible = true;
          this.shownData.push(data.Feedback[0].text); // Add shown data to shownData array
          setTimeout(() => {
            this.isVisible = false;
          }, 5000); // Hide after 5 seconds
        }
      });

        this.callIntent = res?.filter(f => f.intent_data != '')[0]?.intent_data[0];
        // console.log(this.callIntent);
        if (this.callIntent != null && this.callIntent != undefined) {
          this.callIntent = this.callIntent.value[0]?.name
        }
        //console.log(this.transcriptData);
        this.call_summary = this.transcriptData?.filter(f => f?.Call_summary != '')[0]?.Call_summary.split("\\n");
        // console.log(this.call_summary);
        if (this.call_summary?.length > 1) {
          if (this.transcriptData[this.transcriptData?.length - 1]?.Call_summary.length > 0) {
            this.callWrapForm = this.formBuilder.group({
              call_description: [{ value: this.call_summary ? this.call_summary[1] : '', disabled: true }],
              call_action: [{ value: this.call_summary ? this.call_summary[3] : '', disabled: true }],
              call_outcome: [{ value: this.call_summary ? this.call_summary[5] : '', disabled: true }],
            });
          }
        }
        else {
          this.callWrapForm?.reset();
        }

        this.scrollToBottom();

      })

      this.localStorageCheck();
    }


  localStorageCheck() {
      localStorage.removeItem('lastTime1');
      localStorage.removeItem('lastTime2');
      localStorage.removeItem('lastTime3');
      localStorage.removeItem('lastTime4');
      localStorage.removeItem('lastTime5');
      localStorage.removeItem('lastTime6');
      localStorage.removeItem('lastTime7');

      if(!localStorage.getItem('issmart-assistcallTranscript')) {
      localStorage.setItem('issmart-assistcallTranscript', 'true')
    }
    if (!localStorage.getItem('issmart-assistProceduralGuidance')) {
      localStorage.setItem('issmart-assistProceduralGuidance', 'true')
    }
    if (!localStorage.getItem('issmart-assistCallSummary')) {
      localStorage.setItem('issmart-assistCallSummary', 'true')
    }
    if (!localStorage.getItem('issmart-assistExtractedDetails')) {
      localStorage.setItem('isExtractedDetails', 'true')
    }
    if (!localStorage.getItem('issmart-assistLiveFeedback')) {
      localStorage.setItem('issmart-assistLiveFeedback', 'true')
    }
    if (!localStorage.getItem('issmart-assistSentiments')) {
      localStorage.setItem('issmart-assistSentiments', 'true')
    }
    if (!localStorage.getItem('issmart-assistLiveAudit')) {
      localStorage.setItem('issmart-assistLiveAudit', 'true')
    }
    this.iscallTranscript = JSON.parse(localStorage.getItem('issmart-assistcallTranscript'))
    this.isProceduralGuidance = JSON.parse(localStorage.getItem('issmart-assistProceduralGuidance'))
    this.isCallSummary = JSON.parse(localStorage.getItem('issmart-assistCallSummary'))
    this.isExtractedDetails = JSON.parse(localStorage.getItem('issmart-assistExtractedDetails'))
    this.isLiveFeedback = JSON.parse(localStorage.getItem('issmart-assistLiveFeedback'))
    this.isSentiments = JSON.parse(localStorage.getItem('issmart-assistSentiments'))
    this.isLiveAudit = JSON.parse(localStorage.getItem('issmart-assistLiveAudit'))
  }

  public onScrollEvent(event: any): void {
    // console.log(event);
  }

  autoScroll() {
    this.containerElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: "nearest" });
  }

  multiLine(text: string): boolean {
    return text.includes('\n');
  }
  checkForSplit(text: string) {
    if (text.indexOf('\n')) {
      return this.splitByNewLine(text)
    } else {
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

  like(post: any) {
    post.liked = !post.liked;
  }
  post = {
    content: 'This is my post content',
    likes: 0,
    liked: false
  };

  editDescription() {
    this.callWrapForm.controls['call_description'].enable();
    this.callWrapForm.controls['call_action'].enable();
    this.callWrapForm.controls['call_outcome'].enable();
  }

}
