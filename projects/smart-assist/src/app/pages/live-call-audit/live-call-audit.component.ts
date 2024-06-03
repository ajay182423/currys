import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import WaveSurfer from 'wavesurfer.js';
import * as Chart from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ActivatedRoute, Router } from '@angular/Router';
import { DriverPopupComponent } from './driver-popup/driver-popup.component';
import { ReferencePopupComponent } from './reference-popup/reference-popup.component';
import { HelperService } from 'common_modules/services/helper.service';
import { environment } from 'projects/smart-assist/src/environments/environment';

@Component({
  selector: 'app-live-call-audit',
  templateUrl: './live-call-audit.component.html',
  styleUrls: ['./live-call-audit.component.scss']
})
export class LiveCallAuditComponent implements OnInit, OnDestroy {

  @ViewChild('containerElement', { static: false }) containerElement: ElementRef;

  baseUrl = environment.jsonFilesUrl;

  transactionId: string = '';
  modalForm1: FormGroup;
  IdFromRoute: number;
  isLoading: boolean = false;
  scoreCalcTotalF: number;
  Audiofile: any = '';
  audioType: any = '';
  scorecalcu: number;
  maxscorecalcu: number;
  transcriptData: any[] = [];
  showTranscriptBox: boolean = false;
  showTransEntitiesBox: boolean = false;
  showAudioPlayer: boolean = false;
  showAudioPlayerWave: boolean = false;
  showSubmitAudit: boolean = false;
  PCIcomment: string;
  resultList: any;
  isColumnRequiredList: any;
  agentName: any;
  audioLength: any;
  currentTime: any;
  callResponse: string;
  queryResolved: string;
  flaggedCall: string;
  questionText :string = '';
  responseData: any[] = [];
  referenceText: string;
  summaryShow: boolean;
  proceduralGuidanceShow: boolean;
  callTranscriptShow: boolean;
  audioSource = '';
  wave: WaveSurfer = null;
  public graph = undefined;
  audioLoading: boolean = false;
  flagDivShow: boolean = false;
  agentDetailShow: boolean = false;
  tableShow: boolean = true;
  checkVul: boolean = true;
  VulSign: string = 'No';
  confidence: number;
  currentAudio: any = '00:00';
  totalScore: any = 'NA';
  enabled:boolean = false;
  public type: string = 'directive';
  public type1: string = 'directive';
  break:boolean = true
  shift:boolean = true

  public config: PerfectScrollbarConfigInterface = {};
  public config2: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective)
  directiveRef?: PerfectScrollbarDirective;

  playingState: boolean = true;
  showAgentDetails: boolean = false;
  audioPlayerLoading: boolean;
  driverData: any;
  copiedText: string = '';
  subscription: Subscription
  observable: any;
  totalCount: number;
  scriptCount: number;
  transcriptDataNew: any;
  vulnerability_Data: any = [];
  customerExtractedDetailsShow: boolean;
  customerExtractedDriverShow: boolean;
  customerExtractedGraphShow: boolean;
  customerExtractedLiveAuditShow: boolean;
  sentimentlabels: any;
  sentimentdataset: any;
  liveAuditData: any = [];
  emailPass: boolean;
  namePass: boolean = false;
  addressPass: boolean = false;
  cardNuberPass: boolean = false;
  secureLinePass: boolean = false;
  changeInfoPass: boolean = false;
  fraudPass: boolean = false;
  refundPass: boolean = false;
  lowRiskPass: boolean = false;
  DOBPass: boolean = false;
  rediatorBlockPass: boolean = false;
  mindateRaditor: boolean = false;
  noHeatingPass:boolean = false;
  contractCencellationPass:boolean = false;

  setupEnquirePaymentPass:boolean = false;
  setupEnquirePaymentTimestamp:any;
  debtPaymentPlanpass: boolean = false;
  debtPaymentPlanTimestamp: any;
  meterReadingPass: boolean = false;
  meterReadingTimeStamp:any;

  contractCencellationTimestamp:any;
  noHeatingTimestamp:any;
  mindateRaditorTimestamp:any;
  rediatorBlockTimestamp: any;
  DobTimestamp:any;
  lowRiskTimestamp:any;
  EODPass:boolean = false;
  emailTimestamp: any;
  nameTimestamp: any;
  addressTimestamp: any;
  idvPass: boolean = true;
  customerIntentPass: boolean = true;
  detailsNotificationCount: number;
  driverNotificationCount: number;
  graphNotificationCount: number;
  liveAuditNotificationCount: number;
  complainDriver:any;
  complainDriverShow:boolean = false;
  lastTimeRecord1: number;
  lastTimeRecord2: number;
  lastTimeRecord3: number;
  lastTimeRecord4: number;

  iscallTranscript:boolean;
  isProceduralGuidance: boolean;
  isCallSummary: boolean;
  isExtractedDetails: boolean;
  isLiveFeedback: boolean;
  isSentiments: boolean;
  isLiveAudit: boolean;
  callSummary:any[] = [];
  showSlider: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private CallAuditService: CallAuditService,
    private AuditRecordsService: AuditRecordsService,
    private modalPopupService: ModalPopupService,
    private toastrService: ToastrService,
    private helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  private transScriptData$ = new BehaviorSubject(null);

  ngOnDestroy(): void {
    this.wave?.stop();
    this.onStopPressed();
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.transactionId = params['transactionId'];
      this.IdFromRoute = params['ID'];
    })
    // this.getJsonTranscriptData();
    this.getAudio();
    this.audioDetails();
    this.agentDetails();
    this.modalForm1 = this.formBuilder.group({
      question: ['', [Validators.required]],
    });
    this.localStorageCheck();
  }
  getJsonTranscriptData() {
    this.helperService.getJSON(this.baseUrl + 'transcript.json').subscribe(data => {
      this.transcriptData = data;
    })
  }
  takeBreakToggle(){
    this.break = !this.break;
  }
  endShiftToggle(){
    this.shift = !this.shift;
  }
  sliderToggle(){
    this.showSlider = !this.showSlider;
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
  agentDetails() {
    this.AuditRecordsService.getRecord(this.transactionId).subscribe((da) => {
      this.showAgentDetails = true;
      this.agentName = da.agentName;
      this.callResponse = da.callResponse;
      this.queryResolved = da.queryResolved;
      this.flaggedCall = da.flag;
      this.agentDetailShow = true;
    });
  }
  convertToSeconds(hours, minutes, seconds){
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }



  GetApiTranscriptData(transactionId: string) {
    let param = {
      input_transaction_id: transactionId,
      bucket: 'next_call_audit',
      input_file_path: 'non_vulnerable_calls/14.wav',
    };
    this.CallAuditService.getMlTranscript(param).subscribe((d) => {
      this.transcriptDataNew = d.transcript;
      console.log(d.transcript)
      const [hours, minutes, seconds] = (d.transcript[d.transcript.length-1]).end_time.split(':');
      this.totalCount =  this.convertToSeconds(hours, minutes, seconds) + 5;
      this.scriptCount =  this.convertToSeconds(hours, minutes, seconds);
        this.observable = interval(1000);
        this.subscription = this.observable
         .pipe(
          take(this.scriptCount+1)
        )
        .subscribe((res) => {
          const seconds = Math.ceil(this.wave.getCurrentTime())

          const newTranscript = d.transcript.filter(f => this.convertToSeconds(f.end_time.split(':')[0],
                                                                               f.end_time.split(':')[1],
                                                                               f.end_time.split(':')[2]
                                                                              ) < seconds);
          if (this.playingState) {
              this.CallAuditService.transScriptData$.next(newTranscript);
          }
          this.scriptCount--;
        });
        this.CallAuditService.transScriptData$.subscribe((res) => {
          // console.log(res)
          this.transcriptData = res;
          this.liveAuditData = [];
          if(res != null) {
            if(res.length > 0) {
              // if(this.customerExtractedDetailsShow == true) {
              //   this.lastTimeRecord1 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
              //   res[res.length-1].end_time.split(':')[1],
              //   res[res.length-1].end_time.split(':')[2]);
              //   localStorage.setItem('lastTime1', this.lastTimeRecord1.toString());
              // }
              // if(this.customerExtractedDetailsShow == false) {
              //   this.detailsNotificationCount = res.filter(f => f.entities != ' ' && this.convertToSeconds(f.end_time.split(':')[0],
              //     f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime1'))).length;
              //   }

              // if(this.customerExtractedDriverShow == true) {
              //   this.driverNotificationCount = 0;
              //   this.lastTimeRecord2 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
              //   res[res.length-1].end_time.split(':')[1],
              //   res[res.length-1].end_time.split(':')[2]);
              //   localStorage.setItem('lastTime2', this.lastTimeRecord2.toString());
              // }
              // if(this.customerExtractedDriverShow == false) {
              //   this.driverNotificationCount = 0;
              //   this.driverNotificationCount = res.filter(f =>
              //     f.Feedback != ''  && this.convertToSeconds(f.end_time.split(':')[0],
              //     f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime2'))
              //   ).length
              // }

              // if(this.customerExtractedGraphShow == true) {
              //   this.lastTimeRecord3 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
              //   res[res.length-1].end_time.split(':')[1],
              //   res[res.length-1].end_time.split(':')[2]);
              //   localStorage.setItem('lastTime3', this.lastTimeRecord3.toString());
              // }
              // if(this.customerExtractedGraphShow == false) {
              //   this.graphNotificationCount = res.slice(-20).filter(f => f.Sentiment < 0 && this.convertToSeconds(f.end_time.split(':')[0],
              //     f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime3'))).length;
              //   }

              // if(this.customerExtractedLiveAuditShow == true) {
              //   this.lastTimeRecord4 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
              //   res[res.length-1].end_time.split(':')[1],
              //   res[res.length-1].end_time.split(':')[2]);
              //   localStorage.setItem('lastTime4', this.lastTimeRecord4.toString());
              // }
              // if(this.customerExtractedLiveAuditShow == false) {
              //   // console.log(this.liveAuditData)
              //   this.liveAuditNotificationCount = this.liveAuditData.filter(f =>
              //     f?.LiveAudit != undefined
              //     && this.convertToSeconds(f?.end_time.split(':')[0],
              //     f?.end_time.split(':')[1],f?.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime4'))).length;
              //   }
                // console.log(res)
              res.forEach(f => {
                if(f != undefined) {
                  this.liveAuditData.push({liveAudit : f, timeStamp: f.end_time})
                }
              });

              if(this.liveAuditData.some(s => s.liveAudit.EOD == 'Pass')){
                this.EODPass = true;
              }
              if(this.liveAuditData.some(s => s.liveAudit.Complaint_Driver != '')){
                this.complainDriverShow = true;
                this.liveAuditData.some(s=> this.complainDriver = s.liveAudit.Complaint_Driver);
              }
              if(this.liveAuditData.some(s => s.liveAudit.Low_risk == 'Pass')) {
                this.lowRiskPass = true;
                this.lowRiskTimestamp = this.liveAuditData.filter(f => f.liveAudit.Low_risk == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.Name == 'Pass')) {
                this.namePass = true
                this.nameTimestamp = this.liveAuditData.filter(f => f.liveAudit.Name == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.DOB == 'Pass')) {
                this.DOBPass = true
                this.DobTimestamp = this.liveAuditData.filter(f => f.liveAudit.DOB == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.Email == 'Pass')) {
                this.emailPass = true
                this.emailTimestamp = this.liveAuditData.filter(f => f.liveAudit.Email == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.Address == 'Pass')) {
                this.addressPass = true
                this.addressTimestamp = this.liveAuditData.filter(f => f.liveAudit.Address == 'Pass')[0].timeStamp
              }
              //customer Intent Pass
              if(this.liveAuditData.some(s => s.liveAudit.Book_appointment_Radiator_blocked_and_bedroom_lighting == 'Pass')) {
                this.rediatorBlockPass = true
                this.rediatorBlockTimestamp = this.liveAuditData.filter(f => f.liveAudit.Book_appointment_Radiator_blocked_and_bedroom_lighting == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.Book_appointment_mandate_radiator == 'Pass')) {
                this.mindateRaditor = true
                this.mindateRaditorTimestamp = this.liveAuditData.filter(f => f.liveAudit.Book_appointment_mandate_radiator == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.Book_appointment_No_Heating == 'Pass')) {
                this.noHeatingPass = true
                this.noHeatingTimestamp = this.liveAuditData.filter(f => f.liveAudit.Book_appointment_No_Heating == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.Contract_cancellation_and_queries == 'Pass')) {
                this.contractCencellationPass = true
                this.contractCencellationTimestamp = this.liveAuditData.filter(f => f.liveAudit.Contract_cancellation_and_queries == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.set_up_or_enquire_about_a_payment_plan == 'Pass')) {
                this.setupEnquirePaymentPass = true
                this.setupEnquirePaymentTimestamp = this.liveAuditData.filter(f => f.liveAudit.set_up_or_enquire_about_a_payment_plan == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.debt_and_payment_plan == 'Pass')) {
                this.debtPaymentPlanpass = true
                this.debtPaymentPlanTimestamp = this.liveAuditData.filter(f => f.liveAudit.debt_and_payment_plan  == 'Pass')[0].timeStamp
              }
              if(this.liveAuditData.some(s => s.liveAudit.meter_reading_submission == 'Pass')) {
                this.meterReadingPass = true
                this.meterReadingTimeStamp = this.liveAuditData.filter(f => f.liveAudit.meter_reading_submission == 'Pass')[0].timeStamp
              }

              this.sentimentlabels = res.map(m => m.end_time).slice(-20);
              this.sentimentdataset = res.map(m => m.Sentiment).slice(-20);
              if(this.customerExtractedGraphShow) {
                  // setTimeout(() => {
                  //   this.sentimentChart(this.sentimentlabels, this.sentimentdataset)
                  // }, 100);
                }

            }
          }
          if(res != null) {
            this.vulnerability_Data = res.filter(f => f.driver.vulnerability_type != 'Not Applicable');
          }
          this.scrollToBottom();
          if(res != null && res.length > 0) {
            this.confidence = res[res.length-1].vulnerability.confidence
            if(res[res.length-1].Call_summary.length > 0){
              this.callSummary = res[res.length-1].Call_summary.split('\\n');
            }
            // this.chartLoad();
            if (res[res.length-1].driver.vulnerability_type != 'Not Applicable') {
              this.driverData = res[res.length-1];
              this.vulnerability_Data.push(res[res.length-1])
              this.VulSign = res[res.length-1].vulnerability.result == "non-vulnerable" ? 'No' : 'Yes'
              return
            }

          }
        });
        this.showTranscriptBox = true;
        this.showTransEntitiesBox = true;
        this.tabShowSequence();
    });
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





  tabShowSequence(){
    if(localStorage.getItem('issmart-assistcallTranscript') == 'true'){
      this.callTranscriptDetails('callTranscript');
    }else if(localStorage.getItem('issmart-assistProceduralGuidance') == 'true'){
      this.callTranscriptDetails('proceduralGuidance');
    }else if(localStorage.getItem('issmart-assistCallSummary') == 'true'){
      this.callTranscriptDetails('summary');
    }else{
      this.iscallTranscript = true;
      this.callTranscriptDetails('callTranscript');
    }

    if(localStorage.getItem('isExtractedDetails') == 'true'){
      this.customerExtractedDetails('details');
    }else if(localStorage.getItem('issmart-assistLiveFeedback') == 'true'){
      this.customerExtractedDetails('driver');
    }else if(localStorage.getItem('issmart-assistSentiments') == 'true'){
      this.customerExtractedDetails('graph');
    }else if (localStorage.getItem('issmart-assistLiveAudit') == 'true'){
      this.customerExtractedDetails('liveAudit');
    }else{
      this.isExtractedDetails = true;
      this.customerExtractedDetails('details');
    }
  }
  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    }
  }

  public onScrollEvent(event: any): void {
    // console.log(event);
  }
  like(post:any){
    post.liked = !post.liked;
  }
  post = {
    content: 'This is my post content',
    likes: 0,
    liked: false
  };
  likePost(post) {
    if (!post.liked) {
      post.likes++;
      post.liked = true;
    } else {
      post.likes--;
      post.liked = false;
    }
  }


  customerExtractedDetails(tabName:string){
    if (tabName === 'details'){
        this.customerExtractedDetailsShow = true;
        this.customerExtractedDriverShow = false;
        this.customerExtractedGraphShow = false;
        this.customerExtractedLiveAuditShow = false;
        this.detailsNotificationCount = 0;
        this.scrollToBottom();
    }
   else if (tabName === 'driver'){
        this.customerExtractedDetailsShow = false;
        this.customerExtractedDriverShow = true;
        this.customerExtractedGraphShow = false;
        this.customerExtractedLiveAuditShow = false;
        this.driverNotificationCount = 0;
        this.scrollToBottom();
    }
   else if (tabName == 'graph'){
        this.customerExtractedDetailsShow = false;
        this.customerExtractedDriverShow = false;
        this.customerExtractedLiveAuditShow = false;
        this.customerExtractedGraphShow = true;
        this.graphNotificationCount = 0;
        // setTimeout(() => {
        //   this.sentimentChart(this.sentimentlabels, this.sentimentdataset)
        // }, 1000);
    }
   else if (tabName == 'liveAudit'){
        this.customerExtractedDetailsShow = false;
        this.customerExtractedDriverShow = false;
        this.customerExtractedGraphShow = false;
        this.customerExtractedLiveAuditShow = true;
        this.liveAuditNotificationCount = 0;
    }
  }
  sentimentChart(labels:any, data :any){
    const canvas = <HTMLCanvasElement> document.getElementById('sentimentChart') ;
    const ctx = canvas?.getContext('2d');
    let brdrClr = [];
    // console.log(data)
    data.forEach(item => {
      if(item > 0) {
        brdrClr.push("green")
      }
     else if(item < 0) {
        brdrClr.push("red")
      }
      else {
        brdrClr.push("blue")
      }
    })


    let dataObj={
      labels: labels,
      datasets: [
              {
              label: '',
              data: data,
              // backgroundColor: brdrClr, //"rgba(0, 0, 0, 0)",
              fill:false,
              fillcolor : brdrClr,
              pointBackgroundColor : brdrClr,
              borderDash: [3, 1],
              tension: 0.4,
              borderColor: '#dee1e6', //brdrClr,
            },
          ]
      }
      var myChart = new Chart(ctx, {
        type: 'line',
        data: dataObj,
        options: {
          events :["touchstart", "touchmove", "touchend"],
          animation: {
            duration: 0
          },
          plugins:{
              labels:{
                  render: 'value',
              },
          },

            scales: {
              xAxes: [{
                  stacked: true,
                  gridLines: {
                      color: "rgba(0, 0, 0, 0)",
                  }
              }],
              yAxes: [{
                  stacked: true,
                  gridLines: {
                      color: "rgba(0, 0, 0, 0)",
                  } ,
                  ticks: {
                      beginAtZero: true,
                      min: -1,
                      max: 1,
                    },
                  scaleLabel: {
                    display: false,
                    labelString: 'Sentiments'
                  }
              }]
            },
            legend: {
              labels : {
                  usePointStyle: true,
                  boxWidth:10,
                  fontSize:13,
                  fontColor:'rgba(0, 0, 0, 1)',
              },
              display: false ,//This will hide the label above the graph
              position:'top',

           },
        }
      });
  }

  copyContent(content) {
    let entity = content.entity + ":" + content.text
    navigator.clipboard.writeText(entity);
    this.copiedText = 'Copied';
    setTimeout(() => {
      this.copiedText = '';
    }, 1000);
  }
  viewResult(){
    this.router.navigate(['/front-office'],
    { queryParams : {transactionId: this.transactionId, ID: this.IdFromRoute}})
  }


  returnResult: any = '';
  remarkStringFill(paramResult: any) {
    paramResult?.otherProperties?.forEach((others) => {
      if (paramResult.auditParameterId == 43) {
        this.PCIcomment = others.comment;
      }
      this.returnResult += others.comment + '\n';
    });
  }
  getAudio() {
    const postData = {
      input_transaction_id: this.transactionId,
      bucket: '',
      input_file_path: ''
    };
    this.audioLoading = true;
    this.audioPlayerLoading = true;
    this.CallAuditService.getAudio(postData)
      .toPromise()
      .then((data: any) => {
        this.Audiofile = data.audio_data;
        this.audioType = data.audio_type;
        this.showAudioPlayer = true;
        this.loadAudio();
        this.onPreviewPressed();
        this.showAudioPlayerWave = true;
        this.checkVul = true;
      });
  }
  convertDataURIToBinary(dataURI) {
    let raw = window.atob(dataURI);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
  loadAudio() {
    if (this.audioType.toLowerCase() == 'mp3') {
      let binary = this.convertDataURIToBinary(this.Audiofile);
      let blob = new Blob([binary], { type: 'audio/mp3' });
      let blobUrl = URL.createObjectURL(blob);
      this.audioSource = blobUrl;
    }
    if (this.audioType.toLowerCase() == 'wav') {
      let binary = this.convertDataURIToBinary(this.Audiofile);
      let blob = new Blob([binary], { type: 'audio/wav' });
      let blobUrl = URL.createObjectURL(blob);
      this.audioSource = blobUrl;
    }
  }

  onPreviewPressed(): void {
    if (!this.wave) {
      this.generateWaveform();
    }
    this.cdr.detectChanges();
    Promise.resolve().then(() => this.wave.load(this.audioSource));
    this.audioLoading = false;
    // this.localStorageCheck();
  }
  onStopPressed(): void {
    this.wave.stop();
    this.CallAuditService.transScriptData$.next(null);
    this.playingState = false;
    this.currentAudio = '00:00';
    this.subscription.unsubscribe()
    // this.localStorageCheck();
  }
  onStartPressed() {
    // this.localStorageCheck();
    this.playingState = !this.wave.isPlaying();
    if (!this.playingState) {
      this.wave.pause();
      this.subscription.unsubscribe()
    } else {
      const seconds = Math.ceil(this.wave.getCurrentTime());
      this.scriptCount = this.totalCount - seconds
      this.wave.play();
      this.subscription = this.observable
         .pipe(
          take(this.scriptCount+1)
        )
        .subscribe((res) => {
          const seconds = Math.ceil(this.wave.getCurrentTime())
          const newTranscript = this.transcriptDataNew.filter(f => this.convertToSeconds(f.end_time.split(':')[0],
                                                                               f.end_time.split(':')[1],
                                                                               f.end_time.split(':')[2]
                                                                              ) < seconds)

                                                                              console.log(this.playingState);
          if (this.playingState) {
              this.CallAuditService.transScriptData$.next(newTranscript);
          }
          if(this.scriptCount > 0) {
            this.scriptCount--;
            this.subscription.unsubscribe();
          }
        });

    }
  }
  timeCalculator(value){
    let second:any = Math.floor(value % 60);
    let minute:any = Math.floor(value / 60) % 60;
    if(second < 10){
      second = "0" + second
    }
    if(minute < 10){
      minute = "0" + minute
    }
    return minute + ":" + second;
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#5c5a5a',
        height:10,
        progressColor: '#fb4e0b',
        cursorColor: 'hsl(0, 0%, 67%)',
        scrollParent: false,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline',
          }),
          Regions.create({
            // regions: [{start: 5, end: 7, loop: false, color: 'hsla(200, 50%, 70%, 0.4)'}],
            dragSelection: {
              slop: 5,
            },
          }),
        ],
      });
 
      this.wave.on('seek', () => {
        this.detailsNotificationCount = 0;
        this.detailsNotificationCount = 0;
        this.graphNotificationCount = 0;
        this.liveAuditNotificationCount = 0;
        // let currentime = Math.ceil(this.wave.getCurrentTime())
        const seconds = Math.ceil(this.wave.getCurrentTime());
        this.scriptCount = this.totalCount - seconds
        // console.log(currentime);
        // console.log(this.wave);
        this.playingState = true;
        this.wave.play();
        console.log(this.scriptCount)
        if(this.playingState){
          this.subscription = this.observable
          .pipe(
            take(this.scriptCount+1)
          )
          .subscribe((res) => {
            const seconds = Math.ceil(this.wave.getCurrentTime())
            const newTranscript = this.transcriptDataNew.filter(f => this.convertToSeconds(f.end_time.split(':')[0],
                                                                                f.end_time.split(':')[1],
                                                                                f.end_time.split(':')[2]
                                                                                ) < seconds)

                                                                                console.log(this.playingState);
            if (this.playingState) {
                this.CallAuditService.transScriptData$.next(newTranscript);
            }
            if(this.scriptCount > 0) {
              this.scriptCount--;
              this.subscription.unsubscribe();
            }
          });
        }
        this.currentAudio = this.timeCalculator(this.wave.getCurrentTime());
        // if(localStorage.getItem('lastTime1')){
        //   localStorage.setItem('lastTime1', String(currentime))
        // }
        // if(localStorage.getItem('lastTime2')){
        //   localStorage.setItem('lastTime2', String(currentime))
        // }
        // if(localStorage.getItem('lastTime3')){
        //   localStorage.setItem('lastTime3', String(currentime))
        // }
        // if(localStorage.getItem('lastTime4')){
        //   localStorage.setItem('lastTime4', String(currentime))
        // }
      });

      this.wave.on('ready', () => {
        this.wave.play();
        this.playingState = true;
      });
      this.wave.on('finish', () => {
        this.playingState = false;
        this.scriptCount = 0;
        console.log(this.scriptCount)
        this.subscription.unsubscribe(); 
        // this.playingState = true;
        this.totalScore = this.scoreCalcTotalF+'%';
        this.enabled = true;
        // this.enabled = true;
        if(this.emailPass == false && this.namePass == false && this.addressPass == false && this.lowRiskPass == false && this.DOBPass == false){
            this.idvPass = false
        }
        if(this.rediatorBlockPass == false && this.mindateRaditor == false && this.noHeatingPass == false
          && this.contractCencellationPass == false && this.meterReadingPass == false && this.debtPaymentPlanpass == false
          && this.setupEnquirePaymentPass == false){
            this.customerIntentPass = false
        }
      });
      this.wave.on('audioprocess', () =>{
        this.currentAudio = this.timeCalculator(this.wave.getCurrentTime());
      })

      this.GetApiTranscriptData(this.transactionId);
    });
  }
  toggle = true;
  status = 'Enable';
  enableDisableRule() {
      this.toggle = !this.toggle;
      this.status = this.toggle ? 'Enable' : 'Disable';
  }

  chartLoad() {
    let remainingConfidence = 100 - this.confidence;
    if (this.VulSign == 'Yes') {
      this.vulnarableChart(
        [''],
        [remainingConfidence, this.confidence]
      );
    } else {
      this.vulnarableChart(
        [''],
        [this.confidence, remainingConfidence]
      );
    }
  }
  vulnarableChart(labels: string[], data: number[]) {
    const canvas = <HTMLCanvasElement> document.getElementById('chart_pci_compliance') ;
    const ctx = canvas?.getContext('2d');

    let bgC1 = [];
    labels.forEach(element => {
        return bgC1.push('hsl(123, 40%, 46%)');
    });
    let bgC2 = [];
    labels.forEach(element => {
        return bgC2.push('hsl(4, 89%, 55%)');
    });

    let dataObj={
        labels: labels,
        datasets: [{
                    label: 'Non-Vulnerable',
                    data:  [data[0]], //data[0],
                    backgroundColor:bgC1,
                    barThickness: 12,
                  },
                  {
                    label: 'Vulnerable',
                    data: [data[1]], //data[1],
                    backgroundColor:bgC2,
                    barThickness: 13,
                  }
            ]
        }
        var myChart = new Chart(ctx, {
          type: 'horizontalBar',
          data: dataObj,
          options: {
            plugins:{
              labels:
                {
                  render: 'percentage',
                  position: 'outside',
                  fontSize: 9,
                  offset:5,
                  fontStyle: 'bold',
                  fontColor: '#000',
                }
              ,
          },
            events :["mouseout", "click", "touchstart", "touchmove", "touchend"],
              animation: {
                duration: 0,
              },
              scales: {
                xAxes: [{
                  display: false,
                  stacked: true,
                  gridLines: {
                      color: "rgba(0, 0, 0, 0)",
                  },
                }],
                yAxes: [{
                  display: false,
                  stacked: true,
                  gridLines: {
                      color: "rgba(0, 0, 0, 0)",
                  } ,
                  ticks: {
                      beginAtZero: true,
                      min: 0,
                      max: 100,
                      stepSize: 20,
                      callback: function (value:any) {
                        return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
                        },
                    },
                }]
              },
              legend: {
                display: true,
                labels : {
                    usePointStyle: true,
                    boxWidth:5,
                    fontSize:12,
                    fontColor:'rgba(0, 0, 0, 1)',
                },
                position:'bottom',
            },
          }
        });
      }
  audioDetails() {
    this.AuditRecordsService.getRecord(this.transactionId).subscribe((da) => {
      this.agentName = da.agentName;
      this.audioLength = JSON.parse(da.callDetails).audio_length;
      this.callResponse = da.callResponse;
      this.queryResolved = da.queryResolved;
      this.flaggedCall = da.flag;
    });
  }

  clickDriver(){
    this.openDriverPopup(this.transcriptData);
  }
  openDriverPopup(val: any) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: val,
      popupPosition: 'centre',
      heading: 'Driver Detected',
      width: '60rem',
      height: '50rem',
      popup: DriverPopupComponent,
    });
  }

  submitForm() {
    // Shaowing loader while data comes
    this.isLoading = true;

    if(!this.modalForm1.valid){
      this.toastrService.error('Please enter the question!');
      return;
    }

    // checking the form value exist
    // if(this.question.value) {

    // Assigning the question text
    this.questionText = this.modalForm1.controls['question'].value

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
    this.modalForm1.controls['question'].setValue('');

  }

  openPopup(text:any, textName:any) {
    console.log(text)
      let sourceText = `
        <style style='text/scss'>
          .container {
            max-width:800px;
            width:90%;
            margin:0 auto
          }
          .container header, .container footer {
            display: none;
          }
          .container a {
            color: #311B92;
            font-weight: 500;
          }
          .container h2 {
              font-weight: 600;
              color: #757575;
          }
          .container h3 {
              color: #7B1FA2;
              font-weight: 600;
          }
          .container h4 {
              color: #F57C00;
          }
          .container img {
              margin: 0 auto;
              display: block;
              max-width: 100%;
          }
          .container ul {
              margin: 0;
              padding: 0;
              list-style: none;
              padding-left: 10px;
          }
          .container li {
              position: relative;
              padding-left: 20px;
          }
          .container li:before {
              position: absolute;
              content: '';
              width: 6px;
              height: 6px;
              background: #c00;
              border-radius: 50%;
              left: 0;
              top: 7px;
          }
        </style>
        <div class="container">`
          + text +
        `</div>`;
      this.openReferencePopup(sourceText, textName)
  }
  vulthumbsUp:boolean = false;
  vulthumbsdown:boolean = false;
  feebackThumbsUp:boolean = false;
  feebackThumbsDown:boolean = false;
  giveVulthumsUp(){
    this.transcriptData.forEach((e,i) =>{
      if(e.driver.vulnerability_type != 'Not Applicable'){
        this.vulthumbsUp = !this.vulthumbsUp;
        console.log(e)
      }
    })
  }
  giveVulthumsDown(i){
    this.vulthumbsdown = !this.vulthumbsdown;
  }
  giveFeedbackthumsUp(){
    this.feebackThumbsUp = !this.feebackThumbsUp;
  }
  giveFeedbackthumsDown(){
    this.feebackThumbsDown = !this.feebackThumbsDown;
  }

  openReferencePopup(val:any, textName:any){
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: val,
      popupPosition: 'centre',
      heading: `${'Source :'+textName}`,
      width:'50vw',
      height: '65vh',
      popup: ReferencePopupComponent
    });

  }
  callTranscriptDetails(tabName:string){
    if (tabName === 'callTranscript'){
        this.callTranscriptShow = true;
        this.proceduralGuidanceShow = false;
        this.summaryShow = false;
        this.scrollToBottom();
    }
   else if (tabName === 'proceduralGuidance'){
        this.callTranscriptShow = false;
        this.proceduralGuidanceShow = true;
        this.summaryShow = false;
    }
   else if (tabName === 'summary'){
        this.callTranscriptShow = false;
        this.proceduralGuidanceShow = false;
        this.summaryShow = true;
    }
  }



}
