import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { Subscription } from 'rxjs';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { HelperService } from 'common_modules/services/helper.service';
import { environment } from 'projects/smart-assist/src/environments/environment';

@Component({
  selector: 'app-call-information',
  templateUrl: './call-information.component.html',
  styleUrls: ['./call-information.component.scss']
})
export class CallInformationComponent implements OnInit, OnDestroy {

  @ViewChild('containerElement', { static: false }) containerElement: ElementRef;

  baseUrl = environment.jsonFilesUrl;

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective)
  directiveRef?: PerfectScrollbarDirective;

  callInfoShow: boolean;
  callHistoryShow: boolean;
  copiedText: string = '';
  subscription: Subscription

  iscallTranscript:boolean;
  isCustomerInfoVerified:boolean = false;
  isProceduralGuidance: boolean;
  isCallSummary: boolean;
  isExtractedDetails: boolean;
  isLiveFeedback: boolean;
  isSentiments: boolean;
  isLiveAudit: boolean;
  callSummary:any[] = [];
  type: string;
  customerInfoForm: FormGroup;
  contactInfoForm: FormGroup;
  travelInfoForm: FormGroup;
  bookingSelectionForm: FormGroup;
  modalForm: FormGroup[] = [];
  transcriptData: any[] = [];
  formData: any;
  entities: any[] = [];
  callHistory: any;
  customer_details: any[] = [];
  currentIndex: any;
  CallHistorychecked:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private CallAuditService: CallAuditService,
    private helperService: HelperService,
  ) {
    this.callTranscriptDetails('call_info');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.entities = [];
    this.transcriptData = [];
  }

  ngOnInit(): void {
    this.localStorageCheck();
    this.fillCallInfo();
    this.subscription = this.CallAuditService.transScriptData$.subscribe(data => {
      this.entities = [];
      this.callHistory = data?.filter(f => f.check_value != '')[0]?.check_value;
      data?.filter(f => f.entities_check != '').forEach(element => {
       if(Object.values(element.entities_check?.verification).includes("verified")) {
            Object.keys(element.entities_check.verification).forEach((en) => {
              if(!this.entities.includes(en)) {
                this.entities.push(en)
              }
            })
          }
      });
      this.transcriptData = data;
    })
  }


  checkVerified(controlName){
    return this.entities.includes(controlName);
  }
  checkHeaderVerified(heading){
    return this.entities.includes(heading);
  }

  fillCallHitory() {
    this.helperService.getJSON(this.baseUrl + 'call_history.json').subscribe(data => {
      this.callHistory = data;
    })
  }
  toggleDiv(index) {
    if(index != this.currentIndex) {
      this.currentIndex = index
    }
    else {
      this.currentIndex = 0
    }
  }

  clickedDiv(clickedIndex){
      return this.currentIndex == clickedIndex
  }
  fillCallInfo(){
    this.CallAuditService.transScriptData$.subscribe(data => {
      // console.log(data);
      if(data?.length > 0){
        this.customer_details = data[0]?.customer_details;
        this.formData = data[0]?.customer_details;
          data[0].customer_details.forEach((item, i) => {
            this.modalForm[i] = this.formBuilder.group({
              // isCollapsed : false
            });
            item.content.forEach(element => {
              this.modalForm[i].addControl(element.controlName, new FormControl(element.controlValue));
            });

          });
        }

      // this.customerInfoForm = this.formBuilder.group({
      //   employee_number: ['12345'],
      //   employee_name: [''],
      //   company_name: [''],
      //   designation: [''],
      //   job_band: [''],
      //   corporate_card: ['']
      // });
      // this.contactInfoForm = this.formBuilder.group({
      //   email_id: ['12345'],
      //   phone_number: [''],
      //   alternate_phone_number: [''],
      //   full_address: ['']
      // });
      // this.travelInfoForm = this.formBuilder.group({
      //   travel_type: ['12345'],
      //   allowable_class: [''],
      //   meal_preference: [''],
      //   seat_preference: ['']
      // });

      // this.bookingSelectionForm = this.formBuilder.group({
      //   passenger_name: ['12345'],
      //   departure_city: [''],
      //   return_city: [''],
      //   departure_date: [''],
      //   return_date: [''],
      //   departure_time: [''],
      //   departure_airport: [''],
      //   return_airport: [''],
      //   airline: [''],
      //   stop: [''],
      //   bags: ['']
      // });
    })
  }
  callTranscriptDetails(tabName:string){
    if (tabName === 'call_info'){
        this.callInfoShow = true;
        this.callHistoryShow = false;
        this.scrollToBottom();
    }
   else if (tabName === 'call_histoty'){
        this.callInfoShow = false;
        this.callHistoryShow = true;
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

  copyContent(content) {
    let entity = content.entity + ":" + content.text
    navigator.clipboard.writeText(entity);
    this.copiedText = 'Copied';
    setTimeout(() => {
      this.copiedText = '';
    }, 1000);
  }

  toggleCallHistoryArrow(){
    this.CallHistorychecked = !this.CallHistorychecked;
  }







}
