import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import WaveSurfer from 'wavesurfer.js';
import * as Chart from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { ActivatedRoute } from '@angular/router';
import { AuditParameterTypeService } from 'projects/smart-assist/src/app/services/settings/audit-parameter-type.service';
import { AuditStatusService } from 'projects/smart-assist/src/app/services/settings/audit-status.service';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { BehaviorSubject, from, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  PerfectScrollbarComponent,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarDirective,
} from 'ngx-perfect-scrollbar';
import { HelperService } from 'common_modules/services/helper.service';
import { environment } from 'projects/smart-assist/src/environments/environment';

@Component({
  selector: 'app-vulnerable-customer',
  templateUrl: './vulnerable-customer.component.html',
  styleUrls: ['./vulnerable-customer.component.scss'],
})
export class VulnerableCustomerComponent implements OnInit {
  jsonUrl: string = environment.jsonFilesUrl;

  customForm: FormGroup[] = [];
  isLoading: boolean = false;
  modalForm: FormGroup;
  isPlaying: boolean = false;
  isShowing: boolean = false;
  transactionId: string = '';
  auditData: any = [];
  maxSorePercentage: any = 0;
  scoreCalcTotalF: number;
  Audiofile: any = '';
  audioType: any = '';
  scorecalcu: number;
  maxscorecalcu: number;
  transcriptData: any[] = [];
  showTranscriptBox: boolean = false;
  showAudioPlayer: boolean = false;
  showAudioPlayerWave: boolean = false;
  showSubmitAudit: boolean = false;
  PCIcomment: string;
  resultList: any;
  isColumnRequiredList: any;
  agentName: any;
  audioLength: any;
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
  VulSign: string = '';
  confidence: number;
  newResponse: any[] = [];
  newSectionResponse: any[] = [];

  public type: string = 'directive';

  @ViewChildren('messages') messages: QueryList<any>;
  // @ViewChild('content') content: ElementRef;

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective)
  directiveRef?: PerfectScrollbarDirective;
  playingState: boolean = true;
  sectionData: any[];
  callAuditData: any;

  constructor(
    private formBuilder: FormBuilder,
    private CallAuditService: CallAuditService,
    private AuditParameterTypeService: AuditParameterTypeService,
    private AuditRecordsService: AuditRecordsService,
    private AuditStatusService: AuditStatusService,
    private modalPopupService: ModalPopupService,
    private helperService: HelperService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  private transScriptData$ = new BehaviorSubject(null);
  private sectionDataSubject$ = new BehaviorSubject(null);

  ngOnInit(): void {
    this.modalForm = this.formBuilder.group({
      transaction: [{ value: '', disabled: false }],
    });
  }
  agentDetails() {
    this.AuditRecordsService.getRecord(this.transactionId).subscribe((da) => {
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
    this.CallAuditService.getTranscript(param).subscribe((d) => {
      console.log(d.transcript);
        interval(1000)
        .pipe(
          take(d.transcript.length),
          map((i) => d.transcript[i])
        )
        .subscribe((res) => {
          const seconds = Math.ceil(this.wave.getCurrentTime())
          const newTranscript = d.transcript.filter(f => this.convertToSeconds(f.end_time.split(':')[0],
                                                                               f.end_time.split(':')[1],
                                                                               f.end_time.split(':')[2]
                                                                              ) < seconds)
          if (this.playingState) {
              this.transScriptData$.next(newTranscript);
            // }
          }
          // debugger;
        });

        this.transScriptData$.subscribe((res) => {
          this.transcriptData = res;
          this.scrollToBottom();
        });
        this.showTranscriptBox = true;
    });
  }

  ngAfterViewInit() {
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    }
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
      input_file_path: '',
      transcript_ID: '',
    };
    this.audioLoading = true;
    this.CallAuditService.getAudio(postData)
      .toPromise()
      .then((data: any) => {
        this.Audiofile = data.audio_data;
        this.audioType = data.audio_type;
        this.loadAudio();
        this.onPreviewPressed();
        this.showAudioPlayerWave = true;
        this.checkVul = true;
        this.chartLoad();
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
    this.isPlaying = true;
  }
  onStartPressed(playStatus: boolean) {
    // this.GetApiTranscriptData(this.transactionId)
    // console.log(this.wave.getCurrentTime())
    // console.log(this.wave.getDuration())
    this.playingState = playStatus;
    if (!playStatus) {
      this.wave.pause();
    } else {
      this.wave.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#5c5a5a',
        progressColor: '#fb4e0b',
        // minPxPerSec:1,
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

      // setInterval(() => {

        // this.wave.on('audioprocess', ()=> {

          // if(this.callAuditData) {
          //   interval(2000)
          //   .pipe(
          //     take(this.callAuditData.transcript.length),
          //     map((i) => this.callAuditData.transcript[i])
          //   )
          //   .subscribe((res) => {
          //     const seconds = this.wave.getCurrentTime()
          //     var date = new Date(null);
          //     date.setSeconds(seconds);
          //     var hhmmssFormat = date.toISOString().substr(11, 8);

          //     ( hhmmssFormat > res.end_time)
          //     if (this.playingState) {
          //       if(hhmmssFormat > res.end_time) {
          //         console.log(res)
          //         debugger;
          //         this.newResponse.push(res);
          //         this.transScriptData$.next(this.newResponse);
          //       }
          //     }
          //   });
          // }


        // }, 1000); //


      this.wave.on('ready', () => {
        this.wave.play();
      });
      this.wave.on('finish', () => {
        this.playingState = false;
        this.isPlaying = true;

      });
      this.GetApiTranscriptData(this.transactionId);
    });
  }



  chartLoad() {
    let remainingConfidence = 100 - this.confidence;
    if (this.VulSign == 'Yes') {
      this.vulnarableChart(
        ['Non Vulnerable', 'Vulnerable'],
        [remainingConfidence, this.confidence]
      );
    } else {
      this.vulnarableChart(
        ['Non Vulnerable', 'Vulnerable'],
        [this.confidence, remainingConfidence]
      );
    }
  }
  vulnarableChart(labels: string[], data: number[]) {
    var canvas = <HTMLCanvasElement>(
      document.getElementById('chart_pci_compliance')
    );
    var ctx = canvas.getContext('2d');
    var chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Weightage',
            data: data,
            backgroundColor: [
              'hsl(123, 40%, 46%)',
              'hsl(4, 89%, 55%)',
              'hsl(36, 100%, 47%)',
            ],
          },
        ],
      },
      options: {
        animation: {
          duration: 0
      },
        plugins: {
          labels: {
            render: 'percentage',
            fontColor: '#fff',
            fontSize: 10,
          },
        },
        legend: {
          labels: {
            usePointStyle: true,
            // boxWidth:4,
            fontSize: 10,
            fontColor: 'black',
          },
          display: true, //This will hide the label above the graph
          position: 'right',
        },
        tooltips: {
          enabled: true,
        },
        responsive: true,
      },
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
      this.toastrService.error('Please Enter The Transation Id First');
      return;
    } else {
      // this.CallAuditService.getRecord(this.transactionId).subscribe((data) => {
      this.helperService
        .getJSON(this.jsonUrl + 'section-data.json')
        .subscribe((data) => {
          this.AuditParameterTypeService.isColumnRequiredList().subscribe(
            (d) => {
              this.isColumnRequiredList = d;
            }
          );
          this.AuditStatusService.resultList().subscribe((result) => {
            this.resultList = result.map((m) => ({
              id: m.status,
              name: m.status,
            }));
          });
          let i = 0;

          // while(i < 1){
          //   i++;
          //   console.log(i)
          // }

          if (data.sections.length > 0) {
            const section = data.sections[0]
            // data.sections.forEach((section) => {
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
              section?.results?.forEach((val) => {
                if (val.auditParameterId == 22)
                  this.VulSign = val.auditResult;
              });
              let cropParam = section?.results?.slice(
                1,
                section.results.length
              );
              cropParam.forEach((paramResult, i) => {
                //add param score to total score var
                this.confidence = paramResult.confidence;
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
                this.customForm[i] = this.formBuilder.group({
                  result: [paramResult.auditResult],
                  score: [paramResult.score],
                  confidence: [
                    { value: paramResult.confidence, disabled: true },
                  ],
                  fatal: [paramResult.fatal],
                  AssociatedTranscript: [this.remarkStringFill(paramResult)],
                });
                //score and Perceantage Calulation
                this.scorecalcu = paramResult.score + this.scorecalcu;
                this.maxscorecalcu =
                  this.maxscorecalcu + paramResult.maxScore;
                this.maxSorePercentage =
                  this.maxSorePercentage + paramResult.maxScore;
                this.scoreCalcTotalF = Math.round(
                  (this.scorecalcu / this.maxSorePercentage) * 100
                );
                i = i + 1;
              });

              // this.sectionsData.push(sectionData);
              this.sectionsData =  new Array(sectionData);

              // console.log(this.sectionsData)

              // debugger;
                // debugger;
              // this.chartLoad();

              //  console.log(this.sectionsData)

              // const array = [1, 2, 3, 4, 5];

              // this.helperService.getJSON(this.jsonUrl+ 'section-data.json').subscribe(response => {
              // console.log(response.sections);
              // interval(3000)
              // .pipe(
              //   take(response.length),
              //   map(i => response[i])
              //   )
              //   .subscribe(data => {
              //     this.newSectionResponse.push(data)
              //     this.sectionData$.next(data)
              //     // console.log(this.newSectionResponse);
              //   });
              // })

              // this.sectionData$.subscribe(data =>{
              //   console.log(data);
              //  this.sectionsData = [data]
              //  this.chartLoad();
              // })


              this.showSubmitAudit = true;
            // });
          }

          interval(10000)
            .pipe(
              take(data.sections.length),
              map((n) => data.sections[n])
            )
            .subscribe((dataset) => {
              // console.log(dataset);
              this.newSectionResponse = new Array(dataset)
              this.sectionDataSubject$.next(this.newSectionResponse);

              this.sectionDataSubject$.subscribe((sectionData1) => {
                // console.log(sectionData1);
                this.sectionData = sectionData1;
                if (this.sectionData.length > 0) {
                  this.sectionData.forEach((section) => {
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
                    section?.results?.forEach((val) => {
                      if (val.auditParameterId == 22)
                        this.VulSign = val.auditResult;
                    });
                    let cropParam = section?.results?.slice(
                      1,
                      section.results.length
                    );
                    cropParam.forEach((paramResult, i) => {
                      //add param score to total score var
                      this.confidence = paramResult.confidence;
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
                      this.customForm[i] = this.formBuilder.group({
                        result: [paramResult.auditResult],
                        score: [paramResult.score],
                        confidence: [
                          { value: paramResult.confidence, disabled: true },
                        ],
                        fatal: [paramResult.fatal],
                        AssociatedTranscript: [this.remarkStringFill(paramResult)],
                      });
                      //score and Perceantage Calulation
                      this.scorecalcu = paramResult.score + this.scorecalcu;
                      this.maxscorecalcu =
                        this.maxscorecalcu + paramResult.maxScore;
                      this.maxSorePercentage =
                        this.maxSorePercentage + paramResult.maxScore;
                      this.scoreCalcTotalF = Math.round(
                        (this.scorecalcu / this.maxSorePercentage) * 100
                      );
                      i = i + 1;
                    });

                    this.sectionsData =  new Array(sectionData);
                      setTimeout(() => {
                        this.chartLoad();
                      }, 100);
                      // debugger;
                    // this.chartLoad();

                    //  console.log(this.sectionsData)

                    // const array = [1, 2, 3, 4, 5];

                    // this.helperService.getJSON(this.jsonUrl+ 'section-data.json').subscribe(response => {
                    // console.log(response.sections);
                    // interval(3000)
                    // .pipe(
                    //   take(response.length),
                    //   map(i => response[i])
                    //   )
                    //   .subscribe(data => {
                    //     this.newSectionResponse.push(data)
                    //     this.sectionData$.next(data)
                    //     // console.log(this.newSectionResponse);
                    //   });
                    // })

                    // this.sectionData$.subscribe(data =>{
                    //   console.log(data);
                    //  this.sectionsData = [data]
                    //  this.chartLoad();
                    // })

                    this.chartLoad();
                    this.showSubmitAudit = true;
                  });
                }
              });
            });

          this.modalForm.controls['transaction'].disable();
          this.flagDivShow = true;
        });
      this.showAudioPlayer = true;
      this.agentDetails();
      this.getAudio();
      this.auidoDetails();
      // setTimeout(() => {
      //   this.chartLoad();
      // }, 5000);
    }
  }
  auidoDetails() {
    this.AuditRecordsService.getRecord(this.transactionId).subscribe((da) => {
      this.agentName = da.agentName;
      this.audioLength = JSON.parse(da.callDetails).audio_length;
      this.callResponse = da.callResponse;
      this.queryResolved = da.queryResolved;
      this.flaggedCall = da.flag;
    });
  }

  openHelpText(val: any) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: val,
      popupPosition: 'centre',
      heading: 'Help Text',
      width: '50rem',
      height: '40rem',
      // popup: HelpTextComponent,
    });
  }
}
