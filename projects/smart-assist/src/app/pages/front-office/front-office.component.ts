import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import WaveSurfer from 'wavesurfer.js';
import * as Chart from 'chart.js';
import { FormBuilder,FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { HelperService } from 'common_modules/services/helper.service';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { HelpTextComponent } from './help-text/help-text.component';
import { ActivatedRoute } from '@angular/Router';
import { IPostCallAudit } from '../../interfaces/pages/call-audit';
import { ICallAuditSection } from '../../interfaces/pages/call-audit-section';
import { ICallAuditResults } from '../../interfaces/pages/call-audit-results';
import { AuditParameterTypeService } from 'projects/smart-assist/src/app/services/settings/audit-parameter-type.service';
import { AuditStatusService } from 'projects/smart-assist/src/app/services/settings/audit-status.service';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service'
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { AudioDetailsComponent } from './audio-details/audio-details.component';
import { AsociatedTranscriptComponent } from './asociated-transcript/asociated-transcript.component';


@Component({
  selector: 'app-front-office',
  templateUrl: './front-office.component.html',
  styleUrls: ['./front-office.component.scss'],
})
export class FrontOfficeComponent implements OnInit {

  customForm: FormGroup[] = [];
  isLoading: boolean = false;
  modalForm: FormGroup;
  PostCallAuditObj: IPostCallAudit;
  callAuditObjSection: ICallAuditSection[] = [];
  callAuditObjResult: ICallAuditResults[] = [];
  isPlaying: boolean = false;
  isShowing: boolean = false;
  transactionId: string = '';
  maxSorePercentage: any = 0;
  scoreCalcTotalF: number;
  Audiofile: any = '';
  audioType: any = '';
  scorecalcu: number;
  maxscorecalcu: number;
  audioObj: any;
  TransactionIdFromRoute: string;
  IdFromRoute: number;
  transcriptData: any[] = [];
  showTranscriptBox: boolean = false;
  showAudioPlayer: boolean = false;
  showAudioPlayerWave: boolean = false;
  showSubmitAudit: boolean = false;
  filterText: string = '';
  resultList: any;
  isColumnRequiredList: any;
  agentName: any;
  audioLength: any;
  callResponse: string;
  workGroup: any;
  moredetails:boolean = false;
  department:any;
  queryResolved: string;
  flaggedCall: string;
  audioSource = '';
  wave: WaveSurfer = null;
  public graph = undefined;
  audioLoading: boolean = false;
  sectionData: any;
  totalTime: any;
  PCIcomment: string;
  startTime: any;
  endTime: any;
  startTimeF : number;
  endTimeF: number;
  sentimentlabels: any;
  sentimentdataset: any;
  nonSilence: any;
  silence: any;
  postOtherData:any={};
  editedData :any = {};



  constructor(
    private formBuilder: FormBuilder,
    private CallAuditService: CallAuditService,
    private AuditParameterTypeService: AuditParameterTypeService,
    private AuditRecordsService: AuditRecordsService,
    private AuditStatusService: AuditStatusService,
    private modalPopupService: ModalPopupService,
    private accountService: AccountService,
    private helperService: HelperService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.helperService.currentData$.subscribe(obj => {
      if(obj) {
        this.editedData.otherProperties = obj.data.map(m => ({
              start_Time: m.value.startTime,
              end_Time : m.value.endTime,
              comment : m.value.associatedTrans
          })
        )
        this.postOtherData = obj.data.map(m => ({
          start_Time: m.value.startTime,
          end_Time : m.value.endTime,
          speaker: m.value.speaker,
          comment : m.value.associatedTrans
          })
        )
        let textAreaValue = this.remarkStringFill(this.editedData);
        this.customForm[obj.index].controls['AssociatedTranscript'].setValue(textAreaValue.returnResult)
        this.customForm[obj.index].controls['AssociatedTranscriptObj'].setValue(textAreaValue.paramResult)
      }
    });

    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      this.TransactionIdFromRoute = params['transactionId'];
      this.IdFromRoute = params['ID'];
      this.modalForm = this.formBuilder.group({
        transaction: [{ value: this.TransactionIdFromRoute, disabled: false }]
      });
      this.getAudit();
    });
    this.AuditRecordsService.getRecord(this.transactionId).subscribe(da =>{
      this.agentName = da.agentName;
      this.audioLength = (JSON.parse(da.callDetails)).audio_length;
      this.department = da.department;
      this.workGroup = da.workGroup;
      this.callResponse = da.callResponse;
      this.queryResolved = da.queryResolved;
      this.flaggedCall = da.flag;
    })
  }
  ngOnDestroy() {
    this.helperService.clearFormData();
  }

  remarkStringFill(paramResult: any) {
    let returnResult: any = '';
    paramResult?.otherProperties?.forEach((others) => {
      if (paramResult.auditParameterId == 43) {
        this.PCIcomment = others.comment;
      }
      returnResult +=
      others.start_Time +' ⇢ '+others.end_Time +'\n' +
      others.comment +'\n';

      this.startTime = others.start_Time;
      this.endTime = others.end_Time;
      const [hours, minutes, seconds] = this.startTime.split(':');
      const [hour, minute, second] = this.endTime.split(':');
      this.startTimeF = this.convertToSeconds(hours, minutes, seconds);
      this.endTimeF = this.convertToSeconds(hour, minute, second);

    });
    return  {returnResult: returnResult, paramResult:paramResult} ;
  }
  openAssoTranscript(val: any, index) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: {val:val, index:index},
      popupPosition: 'centre',
      heading: 'Associated Transcript',
      width: '80rem',
      height: '50rem',
      popup: AsociatedTranscriptComponent,
    });
  }

  convertToSeconds(hours, minutes, seconds){
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

  toggleChange(toggleValue) {
    if (toggleValue) {
      this.filterText = 'Yes';
    } else {
      this.filterText = '';
    }
  }

  playSpanAudio(event, callObject) {
    let audio = <HTMLAudioElement> document.getElementById(event);
    audio.src = this.audioSource + '#t=' + callObject.startTime + ','+ callObject.endTime
    audio.play();

    let timer = ((callObject.endTime +1) - callObject.startTime)*1000
    setTimeout(() => {
      audio.pause()
      audio.src = ''
    }, timer);
   }
   pauseSpanAudio(event, id) {
    let audio =  document.getElementsByTagName('audio');
    for(var i = 0; i<audio.length; i++) {
      audio[i].pause()
    }
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

  GetApiTranscriptData(transactionId: string) {
    let param = {
      input_transaction_id: transactionId,
      bucket: 'next_call_audit',
      input_file_path: 'non_vulnerable_calls/14.wav',
    };
    this.CallAuditService.getMlTranscript(param).subscribe((d) => {
      // console.log(d.transcript);
      this.sentimentlabels = d.transcript.map(m => m.start_time);
      this.sentimentdataset = d.transcript.map(m => m.Sentiment);
        setTimeout(() => {
          this.sentimentChart(this.sentimentlabels, this.sentimentdataset)
        }, 100);
    })
    this.CallAuditService.getTranscript(param).subscribe((d) => {
      this.transcriptData = d.transcript;
      this.showTranscriptBox = true;
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
      return;
    } else {
      this.CallAuditService.getRecord(this.transactionId).subscribe((data) => {
        this.sectionData = data;
        this.AuditParameterTypeService.isColumnRequiredList().subscribe(d => {
          console.log(d)
          this.isColumnRequiredList = d;
        });
        this.AuditStatusService.resultList().subscribe(result =>{
          this.resultList = result.map(m => ({
            id: m.status,
            name: m.status,
          }))
        });
        let i = 0;
        this.sectionsData = [];
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
                  callData : paramResult.otherProperties.map(o =>({
                    comment : o.comment,
                    startTime : this.convertToSeconds(o.start_Time.split(':')[0], o.start_Time.split(':')[1], o.start_Time.split(':')[2]),
                    endTime : this.convertToSeconds(o.end_Time.split(':')[0], o.end_Time.split(':')[1], o.end_Time.split(':')[2]) }
                    ))
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
                callData : paramResult.otherProperties.map(o =>({
                  comment : o.comment,
                  startTime : this.convertToSeconds(o.start_Time.split(':')[0], o.start_Time.split(':')[1], o.start_Time.split(':')[2]),
                  endTime : this.convertToSeconds(o.end_Time.split(':')[0], o.end_Time.split(':')[1], o.end_Time.split(':')[2]) }
                  ))
              });
            }
            this.customForm[i] = this.formBuilder.group({
              result: [paramResult.auditResult],
              score: [paramResult.score],
              confidence: [{ value: paramResult.confidence, disabled: true }],
              AssociatedTranscript: [this.remarkStringFill(paramResult).returnResult],
              AssociatedTranscriptObj: [this.remarkStringFill(paramResult).paramResult],
              backgroundColor: [paramResult.confidence < 80 ? '#FF4527' : ''],
              blinker: [paramResult.confidence < 80]
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
        // this.sectionsData = transFormedData;
      });
      this.GetApiTranscriptData(this.transactionId);
      this.getAudio();
    }
  }

  openHelpText(val: any) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: val,
      popupPosition: 'centre',
      heading: 'Help Text',
      width: '50rem',
      height: '40rem',
      popup: HelpTextComponent,
    });
  }

  callDetails:any;
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
      });
      this.AuditRecordsService.getCallDetails(this.transactionId).subscribe(res => {
        this.callDetails = JSON.parse(res.callDetails);
        this.silence = this.callDetails.silence;
        this.nonSilence = this.callDetails.non_silence;
      })
  }

  AudioDetailsPopup(val:any, res:any){
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: val,res,
      popupPosition: 'centre',
      heading: 'Audio Details',
      width: '90rem',
      height: '60rem',
      popup: AudioDetailsComponent,
    })
  }
  convertDataURIToBinary(dataURI) {
    let raw = window.atob(dataURI);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));
    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  loadAudio(){
    if((this.audioType).toLowerCase() == 'mp3'){
      let binary= this.convertDataURIToBinary(this.Audiofile);
      let blob=new Blob([binary], {type : 'audio/mp3'});
      let blobUrl = URL.createObjectURL(blob);
      this.audioSource = blobUrl;
      this.moredetails =true;
    }
    if((this.audioType).toLowerCase() == 'wav'){
      let binary= this.convertDataURIToBinary(this.Audiofile);
      let blob=new Blob([binary], {type : 'audio/wav'});
      let blobUrl = URL.createObjectURL(blob);
      this.audioSource = blobUrl;
      this.moredetails =true;
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
  }
  onStartPressed(playStatus: boolean){
    if(!playStatus){
      this.wave.play();
    }else{
      this.wave.pause();
    }
    this.isPlaying = !this.isPlaying;
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#5c5a5a',
        barHeight:2,
        progressColor: '#1954d1',
        cursorColor: 'hsl(0, 0%, 67%)',
        scrollParent: false,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline'
          }),
          Regions.create({
            dragSelection: {
              slop: 5
            }
          })
        ]
      });
      this.wave.on('ready', () => {
        this.wave.stop();
        var Time = this.wave.getDuration();
        this.convertTime(Time)
      });
    });
  }
  convertTime(sec){
    sec = Number(sec);
    var h = Math.floor(sec / 3600);
    var m = Math.floor(sec % 3600 / 60);
    var s = Math.floor(sec % 3600 % 60);
    this.totalTime = h + ':' + m + ':' + s;
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
                remarks: element.remarks,
                others: JSON.stringify((this.customForm[k].controls['AssociatedTranscriptObj'].value).otherProperties)
                // JSON.stringify(this.postOtherData)
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
      this.toastrService.success('Audit Updated Suceessfully');
      window.location.reload();
    })
  }

  showVolumeButtons() {
    this.isShowing = !this.isShowing;
    if (this.audioObj.volume != 0) {
      this.audioObj.volume = 0;
    } else {
      this.audioObj.volume = 1;
    }
  }
  setVolume(ev) {
    this.audioObj.volume = ev.target.value;
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
                  ticks: {
                    display: false,
                  },
                  // display: false,
                  gridLines: {
                      color: "rgba(0, 0, 0, 0)",
                  }
              }],
              yAxes: [{
                  stacked: true,
                  display:false,
                  gridLines: {
                      color: "rgba(0, 0, 0, 0)",
                  } ,
                  ticks: {
                      display: false,
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
                  usePointStyle: false,
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



}
