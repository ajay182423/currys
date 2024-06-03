import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import WaveSurfer from 'wavesurfer.js';
import * as Chart from 'chart.js';
import { FormGroup } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { ActivatedRoute, Router } from '@angular/Router';
import { DriverPopupNewComponent } from './driver-popup-new/driver-popup-new.component';
import { NavbarService } from 'common_modules/services/navbar.service';

@Component({
  selector: 'app-live-call-audit-new',
  templateUrl: './live-call-audit-new.component.html',
  styleUrls: ['./live-call-audit-new.component.scss']
})
export class LiveCallAuditNewComponent implements OnInit, OnDestroy {

  transactionId: string = '';
  modalForm: FormGroup;
  socketData = '';
  TransactionIdFromRoute: string;
  IdFromRoute: number;
  jsonUrl: string = environment.jsonFilesUrl;
  customForm: FormGroup[] = [];
  isLoading: boolean = false;
  isPlaying: boolean = false;
  isShowing: boolean = false;
  eodCheck:boolean = false;
  auditData: any = [];
  maxSorePercentage: any = 0;
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
  callType: any;
  currentAudio: any = '00:00';
  totalScore: any = 'NA';
  newResponse: any[] = [];
  newSectionResponse: any[] = [];
  enabled: boolean = false;
  public type: string = 'directive';
  public type1: string = 'directive';

  public config: PerfectScrollbarConfigInterface = {};
  public config2: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective)
  directiveRef?: PerfectScrollbarDirective;
  playingState: boolean = true;
  sectionData: any[];
  callAuditData: any;
  showAgentDetails: boolean = false;
  audioPlayerLoading: boolean;
  driverData: any = [];
  copiedText: string = '';
  subscription: Subscription
  observable: any;
  scriptCount: number;
  transcriptDataNew: any;
  vulnerability_count: number = 0;
  vulnerability_Data: any = [];
  customerExtractedDetailsShow: boolean;
  feedbackDetailsShow: boolean;
  customerExtractedDriverShow: boolean;
  customerExtractedGraphShow: boolean;
  customerExtractedLiveAuditShow: boolean;
  transcriptShow: boolean;
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
  emailTimestamp: any;
  nameTimestamp: any;
  addressTimestamp: any;
  cardNumberTimestamp: any;
  secureLineTimestamp: any;
  changeInfoTimestamp: any;
  fraudTimestamp: any;
  refundTimestamp: any;
  idvPass: boolean = true;
  pciPass: boolean = true;
  pciDisplayPass: boolean = false;
  customerIntentPass: boolean = true;
  detailsNotificationCount: number;
  Customer_Intent: string;
  Manager: string;
  Brand: string;
  transcriptCount: number;
  feedbackNotificationCount: number;
  feedbackNotification: [] = [];
  extractedNotification: [] = [];
  driverNotificationCount: number;
  graphNotificationCount: number;
  liveAuditNotificationCount: number;
  startTimeRecord1: number;
  startTimeRecord2: number;
  startTimeRecord3: number;
  startTimeRecord4: number;
  userExtractedNames: any[] = [];
  userExtractedDetails: any[] = [];
  startTimeRecord5: number;
  countVar: number = 0;
  extractedCountVar: number = 0;

  LocalStorageVarible: string;
  shift: boolean = true;
  break: boolean = true;
  isAgentVisible: boolean = true;
  pgtNotificationCount: number = 0;
  callWrapNotificationCount: number = 0;
  lastTimeRecord1: number;
  lastTimeRecord2: number;
  lastTimeRecord3: number;
  lastTimeRecord4: number;
  lastTimeRecord6: number;
  lastTimeRecord7: number;
  recommendationShow: boolean;
  knowledgeShow: boolean;
  call_wrapShow: boolean;

  constructor(
    public navbarService: NavbarService,
    private accountService: AccountService,
    private CallAuditService: CallAuditService,
    private AuditRecordsService: AuditRecordsService,
    private modalPopupService: ModalPopupService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  private transScriptData$ = new BehaviorSubject(null);
  private sectionDataSubject$ = new BehaviorSubject(null);
  private feedbackNotificationSubject$ = new BehaviorSubject(null);
  private extractedNotificationSubject$ = new BehaviorSubject(null);
  private agentName$ = new BehaviorSubject(null);

  

  ngOnInit(): void {

    this.getTranscriptData();
    localStorage.removeItem('lastTime1');
    localStorage.removeItem('lastTime2');
    localStorage.removeItem('lastTime3');
    localStorage.removeItem('lastTime4');
    localStorage.removeItem('lastTime5');
    localStorage.removeItem('lastTime6');
    localStorage.removeItem('lastTime7');
    // Getting all URL Params
    this.route.queryParams.subscribe((params) => {
      this.transactionId = params['transactionId'];
      this.IdFromRoute = params['ID'];
    })

    // Starting Audit
    this.getAudio();

    this.agentDetails();
    this.audioDetails();

    // Hiding top Navbar
    this.navbarService.showHideNavbar(false);
    (document.querySelector('.app-main') as HTMLElement).style.minHeight = '100vh';
    (document.querySelector('.app-main') as HTMLElement).style.marginTop = '0';
    // (document.querySelector('.ps-page') as HTMLElement).style.height = '100vh';


  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    if (this.wave) {
      this.wave.stop();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // this.navbarService.showHideNavbar(false);
    // Removing all localStorage for this page
    localStorage.removeItem('lastTime1');
    localStorage.removeItem('lastTime2');
    localStorage.removeItem('lastTime3');
    localStorage.removeItem('lastTime4');
    localStorage.removeItem('lastTime5');
    localStorage.removeItem('lastTime6');
    localStorage.removeItem('lastTime7');
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

  // Getting all Agent Details
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

  // Converting Duration to seconds
  convertToSeconds(hours, minutes, seconds) {
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }


  // Getting All Transcript Data by TransactionId
  GetApiTranscriptData(transactionId: string) {
    let param = {
      input_transaction_id: transactionId,
      bucket: 'next_call_audit',
      input_file_path: 'non_vulnerable_calls/14.wav',
    };

    // Calling getMlTranscript method from Call Audit Service
    this.CallAuditService.getMlTranscript(param).subscribe((d) => {

      // console.log(d);
      // storing transcript data for future references
      this.transcriptDataNew = d.transcript
      //console.log(d.transcript)
      // Getting End Time of the last object of the transcript in the form of array [hh, mm, ss]
      const [hours, minutes, seconds] = (d.transcript[d.transcript.length - 1]).end_time.split(':');

      // Measuring the total seconds in transcript
      this.scriptCount = this.convertToSeconds(hours, minutes, seconds)

      // subscribing the transcript observable for scriptCount Time to ensure subscibe to that observable till last object of the array
      this.observable = interval(1000);
      this.subscription = this.observable
        .pipe(
          take(this.scriptCount + 1)
        )
        .subscribe((res) => {
          // getting the current time of the call
          const seconds = Math.ceil(this.wave.getCurrentTime())

          // filtering the data based upon the time. always getting the data which has end_time(in seconds) < the current call time
          const newTranscript = d.transcript.filter(f => this.convertToSeconds(f.end_time.split(':')[0],
            f.end_time.split(':')[1],
            f.end_time.split(':')[2]
          ) < seconds)

          // checking the playing state of the call
          if (this.playingState) {
            this.transScriptData$.next(newTranscript);
            this.CallAuditService.transScriptData$.next(newTranscript);
          }
          // reducing the count by which observable how many times to be subscribe
          this.scriptCount--;
        });


      // Subscribing to feedback notification subject which is coming in tab button
      this.feedbackNotificationSubject$.subscribe(data => {

        if (data != null) {
          // assigning data to feedback notifications property
          this.feedbackNotification = data
        }
        if (data != null && data.length > 0) {
          // disappearing the notification after 3 seconds
          setTimeout(() => {
            this.feedbackNotification = [];
          }, 5000)
        }
        // Increasing the variable for comparison in passsing the notification value
        this.countVar++;
      })

      // Subscribing to extracted user notification subject which is coming in tab button
      this.extractedNotificationSubject$.subscribe(data => {
        if (data != null) {
          // assigning data to extracted user notifications property
          this.extractedNotification = data
        }
        if (data != null && data.length > 0) {
          // disappearing the notification after 3 seconds
          setTimeout(() => {
            this.extractedNotification = []
          }, 5000)
        }
        // Increasing the variable for comparison in passsing the notification value
        this.extractedCountVar++;
      })

      // Subscribing to filtered transcript data subject
      this.transScriptData$.subscribe((res) => {
        // assigning transcript data to
        this.transcriptData = res;

        this.liveAuditData = []
        if (res != null) {
          // res.filter(f => {
          //   return f.entities != ' ' && f.speaker == 'Customer'
          // }).forEach(m => {
          //   if (!this.userExtractedDetails.includes(m)) {
          //     this.userExtractedDetails.push(m)
          //     console.log(this.userExtractedDetails)
          //     if (this.userExtractedDetails.length > 0) {
          //       let userExtractedNames = this.userExtractedDetails.map(m => { return m.entities });
          //       userExtractedNames.forEach(item => {
          //         item?.forEach(entity => {
          //           if (!this.userExtractedNames.includes(entity)) {
          //             this.userExtractedNames.push(entity);
          //           }
          //         })
          //       })
          //       this.userExtractedNames = this.userExtractedNames.filter(f => f.entity.toLowerCase() == 'name');
          //     }
          //   }

          // })

          if (res.length > 0) {
            // if (this.customerExtractedDetailsShow == true) {
            //   this.startTimeRecord1 = this.convertToSeconds(res[res.length - 1].end_time.split(':')[0],
            //     res[res.length - 1].end_time.split(':')[1],
            //     res[res.length - 1].end_time.split(':')[2]);
            //   console.log(this.startTimeRecord1)
            //   localStorage.setItem('startTime1', this.startTimeRecord1.toString());
            //   this.extractedNotification = []
            // }
            // if (this.customerExtractedDetailsShow == false) {
            //   this.detailsNotificationCount = res.filter(f => f.entities != ' ' && this.convertToSeconds(f.end_time.split(':')[0],
            //     f.end_time.split(':')[1], f.end_time.split(':')[2]) > Number(localStorage.getItem('startTime1'))).length;

            //   let detailsNotificationCount = res.filter(f => f.driver.vulnerability_type != 'Not Applicable' && this.convertToSeconds(f.end_time.split(':')[0],
            //     f.end_time.split(':')[1], f.end_time.split(':')[2]) > Number(localStorage.getItem('startTime1'))).length;

            //   if (detailsNotificationCount == this.extractedCountVar) {
            //     let extractedNotification = '';
            //     if (detailsNotificationCount == 1) {
            //       console.log(detailsNotificationCount);
            //       extractedNotification = res.filter(f => f.driver.vulnerability_type != 'Not Applicable' && this.convertToSeconds(f.end_time.split(':')[0],
            //         f.end_time.split(':')[1], f.end_time.split(':')[2]) > Number(localStorage.getItem('startTime1')));
            //     }
            //     if (detailsNotificationCount > 1) {
            //       console.log(detailsNotificationCount);
            //       extractedNotification = res.filter(f => f.driver.vulnerability_type != 'Not Applicable' && this.convertToSeconds(f.end_time.split(':')[0],
            //         f.end_time.split(':')[1], f.end_time.split(':')[2]) > Number(localStorage.getItem('startTime1'))).splice(detailsNotificationCount - 1, detailsNotificationCount);
            //     }

            //     this.extractedNotificationSubject$.next(extractedNotification);
            //   }

            // }

            // if (this.feedbackDetailsShow == true) {
            //   this.startTimeRecord2 = this.convertToSeconds(res[res.length - 1].end_time.split(':')[0],
            //     res[res.length - 1].end_time.split(':')[1],
            //     res[res.length - 1].end_time.split(':')[2]);
            //   localStorage.setItem('startTime2', this.startTimeRecord2.toString());
            //   this.feedbackNotification = []
            // }
            // if (this.feedbackDetailsShow == false) {
            //   this.feedbackNotificationCount = res.filter(f => f.Feedback != '' && this.convertToSeconds(f.end_time.split(':')[0],
            //     f.end_time.split(':')[1], f.end_time.split(':')[2]) > Number(localStorage.getItem('startTime2'))).length;


            //   if (this.feedbackNotificationCount == this.countVar) {
            //     let feedbackNotification = '';

            //     if (this.feedbackNotificationCount == 1) {
            //       feedbackNotification = res.filter(f => f.Feedback != '' && this.convertToSeconds(f.end_time.split(':')[0],
            //         f.end_time.split(':')[1], f.end_time.split(':')[2]) > Number(localStorage.getItem('startTime2')));
            //     }
            //     if (this.feedbackNotificationCount > 1) {
            //       feedbackNotification = res.filter(f => f.Feedback != '' && this.convertToSeconds(f.end_time.split(':')[0],
            //         f.end_time.split(':')[1], f.end_time.split(':')[2]) > Number(localStorage.getItem('startTime2'))).splice(this.feedbackNotificationCount - 1, this.feedbackNotificationCount);
            //     }
            //     this.feedbackNotificationSubject$.next(feedbackNotification);
            //   }


            // }

            // if (this.customerExtractedGraphShow == true) {
            //   this.startTimeRecord3 = this.convertToSeconds(res[res.length - 1].end_time.split(':')[0],
            //     res[res.length - 1].end_time.split(':')[1],
            //     res[res.length - 1].end_time.split(':')[2]);
            //   localStorage.setItem('startTime3', this.startTimeRecord3.toString());
            // }
            // if (this.customerExtractedGraphShow == false) {
            //   this.graphNotificationCount = res.slice(-20).filter(f => f.Sentiment < 0 && this.convertToSeconds(f.end_time.split(':')[0],
            //     f.end_time.split(':')[1], f.end_time.split(':')[2]) > Number(localStorage.getItem('startTime3'))).length;
            // }

            // if (this.customerExtractedLiveAuditShow == true) {
            //   this.startTimeRecord4 = this.convertToSeconds(res[res.length - 1].end_time.split(':')[0],
            //     res[res.length - 1].end_time.split(':')[1],
            //     res[res.length - 1].end_time.split(':')[2]);
            //   localStorage.setItem('startTime4', this.startTimeRecord4.toString());
            // }
            // if (this.customerExtractedLiveAuditShow == false) {
            //   this.liveAuditNotificationCount = res.filter(f =>
            //     f?.LiveAudit != undefined
            //     && this.convertToSeconds(f?.end_time.split(':')[0],
            //       f?.end_time.split(':')[1], f?.end_time.split(':')[2]) > Number(localStorage.getItem('startTime4'))).length;
            // }

            res.forEach((f) => {
              // console.log(res);
              if (f.LiveAudit != undefined) {
                this.liveAuditData.push({ liveAudit: f.LiveAudit, timeStamp: f.end_time })
              }
            });
            if (res.some(s => s.PCIDSS == 'Pass')) {
              this.pciDisplayPass = true;
            }
            if (this.liveAuditData.some(s => s.liveAudit.Email == 'Pass')) {
              this.emailPass = true
              this.emailTimestamp = this.liveAuditData.filter(f => f.liveAudit.Email == 'Pass')[0].timeStamp
            }
            if (this.liveAuditData.some(s => s.liveAudit.Name == 'Pass')) {
              this.namePass = true
              this.nameTimestamp = this.liveAuditData.filter(f => f.liveAudit.Name == 'Pass')[0].timeStamp
            }
            if (this.liveAuditData.some(s => s.liveAudit.Address == 'Pass')) {
              this.addressPass = true
              this.addressTimestamp = this.liveAuditData.filter(f => f.liveAudit.Address == 'Pass')[0].timeStamp
            }
            if (this.liveAuditData.some(s => s.liveAudit.EnterCardNumber == 'Pass')) {
              this.cardNuberPass = true
              this.cardNumberTimestamp = this.liveAuditData.filter(f => f.liveAudit.EnterCardNumber == 'Pass')[0].timeStamp
            }
            if (this.liveAuditData.some(s => s.liveAudit.SecureLine == 'Pass')) {
              this.secureLinePass = true
              this.secureLineTimestamp = this.liveAuditData.filter(f => f.liveAudit.SecureLine == 'Pass')[0].timeStamp
            }
            if (this.liveAuditData.some(s => s.liveAudit.ChangeInformation == 'Pass')) {
              this.changeInfoPass = true
              this.changeInfoTimestamp = this.liveAuditData.filter(f => f.liveAudit.ChangeInformation == 'Pass')[0].timeStamp
            }
            if (this.liveAuditData.some(s => s.liveAudit.Fraud == 'Pass')) {
              this.fraudPass = true
              this.fraudTimestamp = this.liveAuditData.filter(f => f.liveAudit.Fraud == 'Pass')[0].timeStamp
            }
            if (this.liveAuditData.some(s => s.liveAudit.Refund == 'Pass')) {
              this.refundPass = true
              this.refundTimestamp = this.liveAuditData.filter(f => f.liveAudit.Refund == 'Pass')[0].timeStamp
            }
            this.sentimentlabels = res.map(m => m.start_time).slice(-20);
            this.sentimentdataset = res.map(m => m.Sentiment).slice(-20);
            if (this.customerExtractedGraphShow) {
              // setTimeout(() => {
              //   this.sentimentChart(this.sentimentlabels, this.sentimentdataset)
              //   console.log('sentiment')
              // }, 100);
            }
          }
        }
        if (res != null && res.length > 0) {
          if (res[res.length - 1].Manager?.length > 0 || res[res.length - 1].Brand?.length > 0) {
            this.Manager = res[res.length - 1].Manager;
            this.Brand = res[res.length - 1].Brand;
            return
          }
          if (res[res.length - 1].CallType?.length > 0 || res[res.length - 1].Customer_Intent?.length > 0) {
            this.callType = res[res.length - 1].CallType + " ";
            this.Customer_Intent = res[res.length - 1].Customer_Intent + " ";
            return
          }
          if (res[res.length - 1].driver?.vulnerability_type != 'Not Applicable') {
            this.driverData = res[res.length - 1];
            this.vulnerability_Data.push(res[res.length - 1])
            return
          }
          this.VulSign = res[res.length - 1].vulnerability.result == "non-vulnerable" ? 'No' : 'Yes'
          this.confidence = res[res.length - 1].vulnerability.confidence
          // this.chartLoad();
        }
        if(res != null) {
          if(res.length > 0) {
            if(this.showDynamicComponent1 == true) {
              this.detailsNotificationCount = 0
              this.lastTimeRecord1 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
              res[res.length-1].end_time.split(':')[1],
              res[res.length-1].end_time.split(':')[2]);
              localStorage.setItem('lastTime1', this.lastTimeRecord1.toString());
            }
            if(this.showDynamicComponent1 == false) {
              // this.detailsNotificationCount = res.filter(f => (f.entities != ' ' || f.Feedback != '' || f.actions != '') && (this.convertToSeconds(f.end_time.split(':')[0],
              //   f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime1')))).length;

              this.detailsNotificationCount = res.filter(f => (f.entities != ' ' || f.Feedback != '' || f.actions !='')  && (this.convertToSeconds(f.end_time.split(':')[0],
            f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime1')))).length;

            let detailsNotificationCount = res.filter(f => (f.entities != ' ' || f.Feedback != '' || f.actions !='')  && (this.convertToSeconds(f.end_time.split(':')[0],
            f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime1')))).length;

            if(detailsNotificationCount == this.extractedCountVar) {
              let extractedNotification = '';
              if(detailsNotificationCount == 1) {
                  console.log(detailsNotificationCount);
                  extractedNotification = res.filter(f => (f.entities != ' ' || f.Feedback != '' || f.actions !='')  && (this.convertToSeconds(f.end_time.split(':')[0],
                  f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime1'))));
                }
              if(detailsNotificationCount > 1) {
                console.log(detailsNotificationCount);
                extractedNotification = res.filter(f => (f.entities != ' ' || f.Feedback != '' || f.actions !='')  && (this.convertToSeconds(f.end_time.split(':')[0],
                f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime1')))).splice(detailsNotificationCount-1, detailsNotificationCount);
              }

                this.extractedNotificationSubject$.next(extractedNotification);
            }

              }
            if(this.showDynamicComponent4 == true) {
              this.pgtNotificationCount = 0;
              this.lastTimeRecord6 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
              res[res.length-1].end_time.split(':')[1],
              res[res.length-1].end_time.split(':')[2]);
              localStorage.setItem('lastTime6', this.lastTimeRecord6.toString());
            }
            if(this.showDynamicComponent4 == false) {
              // this.pgtNotificationCount = 0;
              this.pgtNotificationCount = res.filter(f =>
                f.Procedural_Guidance != ''  && this.convertToSeconds(f.end_time.split(':')[0],
                f.end_time.split(':')[1],f.end_time.split(':')[2]) > Number(localStorage.getItem('lastTime6'))
              ).length
            }
            if(this.showDynamicComponent3 == true) {
              this.callWrapNotificationCount = 0;
              this.lastTimeRecord7 = this.convertToSeconds(res[res.length-1].end_time.split(':')[0],
              res[res.length-1].end_time.split(':')[1],
              res[res.length-1].end_time.split(':')[2]);
              localStorage.setItem('lastTime7', this.lastTimeRecord7.toString());
            }
            if(this.showDynamicComponent3 == false) {
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
      });
      this.showTranscriptBox = true;
      this.showTransEntitiesBox = true;
      this.customerExtractedDetails('details');

    });
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    }
  }

  public onScrollEvent(event: any): void {
    // console.log(event);
  }
  emailverification() {
    this.emailPass = true;
  }
  nameverification() {
    this.namePass = true;
  }
  addressverification() {
    this.addressPass = true;
  }
  
  customerExtractedDetails(tabName: string) {
    if (tabName === 'details') {
      this.customerExtractedDetailsShow = true;
      this.customerExtractedDriverShow = false;
      this.customerExtractedGraphShow = false;
      this.transcriptShow = false;

      this.customerExtractedLiveAuditShow = false;
      this.feedbackDetailsShow = false;

      this.detailsNotificationCount = 0;
    }
    else if (tabName === 'customerDetails') {
      this.feedbackDetailsShow = true;
      this.customerExtractedDetailsShow = false;
      this.customerExtractedDriverShow = false;
      this.transcriptShow = false;
      this.customerExtractedGraphShow = false;
      this.customerExtractedLiveAuditShow = false;

      this.feedbackNotificationCount = 0;

    }
    else if (tabName === 'transcript') {
      this.transcriptShow = true;
      this.customerExtractedDetailsShow = false;
      this.customerExtractedDriverShow = false;
      this.customerExtractedGraphShow = false;
      this.customerExtractedLiveAuditShow = false;
      this.feedbackDetailsShow = false;


      this.transcriptCount = 0;
      this.feedbackNotificationCount = 0;

    }

    else if (tabName == 'graph') {
      this.customerExtractedDetailsShow = false;
      this.customerExtractedDriverShow = false;
      this.customerExtractedLiveAuditShow = false;
      this.customerExtractedGraphShow = true;
      this.feedbackDetailsShow = false;
      this.transcriptShow = false;

      this.graphNotificationCount = 0;
      // setTimeout(() => {
      //   this.sentimentChart(this.sentimentlabels, this.sentimentdataset)
      // }, 1000);
    }
    else if (tabName == 'liveAudit') {
      this.customerExtractedDetailsShow = false;
      this.customerExtractedDriverShow = false;
      this.customerExtractedGraphShow = false;
      this.customerExtractedLiveAuditShow = true;
      this.feedbackDetailsShow = false;
      this.liveAuditNotificationCount = 0;
    }
  }
  sentimentChart(labels: any, data: any) {
    const canvas = <HTMLCanvasElement>document.getElementById('sentimentChart');
    const ctx = canvas?.getContext('2d');
    let brdrClr = [];
    data.forEach(item => {
      if (item > 0) {
        brdrClr.push("green")
      }
      else if (item < 0) {
        brdrClr.push("red")
      }
      else {
        brdrClr.push("blue")
      }
    })


    let dataObj = {
      labels: labels,
      datasets: [
        {
          label: '',
          data: data,
          // backgroundColor: brdrClr, //"rgba(0, 0, 0, 0)",
          fill: false,
          fillcolor: brdrClr,
          pointBackgroundColor: brdrClr,
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
        events: ["touchstart", "touchmove", "touchend"],
        animation: {
          duration: 0
        },
        plugins: {
          labels: {
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
            },
            ticks: {
              display: false,
              beginAtZero: true,
              min: -1,
              max: 1,
            },
            scaleLabel: {
              display: true,
              labelString: '',
            }
          }]
        },
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            fontSize: 13,
            fontColor: 'rgba(0, 0, 0, 1)',
          },
          display: false,//This will hide the label above the graph
          position: 'top',

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
  viewResult() {
    this.router.navigate(['/call-audit'],
      { queryParams: { transactionId: this.transactionId, ID: this.IdFromRoute } })
  }

  multiLine(text:string): boolean{
    return text.includes('\n');
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
  }
  onStopPressed(): void {
    this.wave.stop();
    this.transScriptData$.next(null);
    this.playingState = false;
    this.currentAudio = '00:00';
    this.subscription.unsubscribe()
  }
  onStartPressed(playStatus: boolean) {
    this.playingState = !this.wave.isPlaying();
    if (!this.playingState) {
      this.wave.pause();
      this.subscription.unsubscribe()
    } else {
      this.wave.play();
      this.subscription = this.observable
        .pipe(
          take(this.scriptCount + 1)
        )
        .subscribe((res) => {
          const seconds = Math.ceil(this.wave.getCurrentTime())
          const newTranscript = this.transcriptDataNew.filter(f => this.convertToSeconds(f.end_time.split(':')[0],
            f.end_time.split(':')[1],
            f.end_time.split(':')[2]
          ) < seconds)
          if (this.playingState) {
            this.transScriptData$.next(newTranscript);
            this.CallAuditService.transScriptData$.next(newTranscript);
          }
          this.scriptCount--;
        });

    }
  }
  timeCalculator(value) {
    let second: any = Math.floor(value % 60);
    let minute: any = Math.floor(value / 60) % 60;
    if (second < 10) {
      second = "0" + second
    }
    if (minute < 10) {
      minute = "0" + minute
    }
    return minute + ":" + second;
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#5c5a5a',
        hideScrollbar: true,
        height: 15,
        progressColor: '#fb4e0b',
        cursorColor: 'hsl(0, 0%, 67%)',
        scrollParent: false,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline',
          }),
          Regions.create({
            dragSelection: {
              slop: 5,
            },
          }),
        ],
      });

      this.wave.on('seek', () => {
        this.countVar = 0;
        this.extractedCountVar = 0;
        let currentime = Math.ceil(this.wave.getCurrentTime())
        this.playingState = true;
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
          this.scriptCount--;
        });
        // if (localStorage.getItem('startTime1')) {
        //   localStorage.setItem('startTime1', String(currentime))
        // }
        // if (localStorage.getItem('startTime2')) {
        //   localStorage.setItem('startTime2', String(currentime))
        // }
      });

      this.wave.on('ready', () => {
        this.wave.play();
        this.playingState = true;
        localStorage.setItem('startTime1', '0')
        localStorage.setItem('startTime2', '0')
      });
      this.wave.on('finish', () => {
        this.playingState = false;
        this.playingState = true;
        this.totalScore = this.scoreCalcTotalF + '%';
        this.enabled = true;
        if (this.emailPass == false && this.namePass == false && this.addressPass == false) {
          this.idvPass = false
        }
        if (this.cardNuberPass == false && this.secureLinePass == false) {
          this.pciPass = false
        }
        if (this.changeInfoPass == false && this.fraudPass == false && this.refundPass == false) {
          this.customerIntentPass = false
        }
        if (this.Customer_Intent == undefined) {
          this.Customer_Intent = 'NA';
        }
      });
      this.wave.on('audioprocess', () => {
        this.currentAudio = this.timeCalculator(this.wave.getCurrentTime());
      })
      this.GetApiTranscriptData(this.transactionId);
    });
  }
  toggle: boolean = true;
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
    const canvas = <HTMLCanvasElement>document.getElementById('chart_pci_compliance');
    const ctx = canvas?.getContext('2d');

    let bgC1 = [];
    labels.forEach(element => {
      return bgC1.push('hsl(123, 40%, 46%)');
    });
    let bgC2 = [];
    labels.forEach(element => {
      return bgC2.push('hsl(4, 89%, 55%)');
    });

    let dataObj = {
      labels: labels,
      datasets: [{
        label: 'Non-Vulnerable',
        data: [data[0]], //data[0],
        backgroundColor: bgC1,
        barThickness: 20,
      },
      {
        label: 'Vulnerable',
        data: [data[1]], //data[1],
        backgroundColor: bgC2,
        barThickness: 20,
      }
      ]
    }
    var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: dataObj,
      options: {
        events: ["mouseout", "click", "touchstart", "touchmove", "touchend"],
        animation: {
          duration: 0
        },
        scales: {
          xAxes: [{
            display: false,
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }],
          yAxes: [{
            display: false,
            stacked: true,
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              beginAtZero: true,
            },
          }]
        },
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
            boxWidth: 7,
            fontSize: 13,
            fontColor: 'rgba(0, 0, 0, 1)',
          },
          position: 'bottom',
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
  clickDriver() {
    this.openDriverPopup(this.transcriptData);
  }
  openDriverPopup(val: any) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: val,
      popupPosition: 'centre',
      heading: 'Driver Detected',
      width: '80%',
      height: '80%',
      popup: DriverPopupNewComponent,
    });
  }

  navigate() {

    //this.router.navigate(['live-call-audit-new'],{ queryParams: { transactionId: this.transactionId, ID: this.IdFromRoute }});
    this.router.navigate(['ai-entity-extract-new']);

  }

  toggleAgentVisibility() {
    this.isAgentVisible = !this.isAgentVisible;
  }

  takeBreakToggle() {
    this.break = !this.break;
  }

  endShiftToggle() {
    this.shift = !this.shift;
  }

  showDynamicComponent1: boolean = false;
  showDynamicComponent2: boolean = false;
  showDynamicComponent3: boolean = false;
  showDynamicComponent4: boolean = false;
  show1 = false;
  show2 = false;
  show3 = false;
  show4 = false;
  variable: boolean = true;


  loadDynamicComponent1() {
    // Set the boolean variable to true to render the dynamic component
    this.variable = false;
    this.showDynamicComponent1 = true;
    this.showDynamicComponent2 = false;
    this.showDynamicComponent3 = false;
    this.showDynamicComponent4 = false;
  }

  loadDynamicComponent2() {
    // Set the boolean variable to true to render the dynamic component
    this.variable = false;
    this.showDynamicComponent1 = false;
    this.showDynamicComponent2 = true;
    this.showDynamicComponent3 = false;
    this.showDynamicComponent4 = false;
  }

  loadDynamicComponent3() {
    // Set the boolean variable to true to render the dynamic component
    this.variable = false;
    this.showDynamicComponent1 = false;
    this.showDynamicComponent2 = false;
    this.showDynamicComponent3 = true;
    this.showDynamicComponent4 = false;
  }

  loadDynamicComponent4() {
    // Set the boolean variable to true to render the dynamic component
    this.variable = false;
    this.showDynamicComponent1 = false;
    this.showDynamicComponent2 = false;
    this.showDynamicComponent3 = false;
    this.showDynamicComponent4 = true;
  }

  showContent(){
    this.variable = true;
    this.showDynamicComponent1 = false;
    this.showDynamicComponent2 = false;
    this.showDynamicComponent3 = false;
    this.showDynamicComponent4 = false;
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
}

