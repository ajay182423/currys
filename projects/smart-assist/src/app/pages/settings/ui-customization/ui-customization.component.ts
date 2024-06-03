import { Component, OnInit } from '@angular/core';
import { slideUp } from 'common_modules/animations/page-animation';

@Component({
  selector: 'app-ui-customization',
  templateUrl: './ui-customization.component.html',
  styleUrls: ['./ui-customization.component.scss'],
  animations: [slideUp],
})

export class UiCustomizationComponent implements OnInit {

  iscallTranscript:boolean;
  isProceduralGuidance: boolean;
  isCallSummary: boolean;
  isExtractedDetails: boolean;
  isLiveFeedback: boolean;
  isSentiments: boolean;
  isLiveAudit: boolean;


  constructor(){}

  ngOnInit(): void {
    this.setLocalStorage();
  }

  setLocalStorage(){
    this.iscallTranscript = JSON.parse(localStorage.getItem('issmart-assistcallTranscript'))
    this.isProceduralGuidance = JSON.parse(localStorage.getItem('issmart-assistProceduralGuidance'))
    this.isCallSummary = JSON.parse(localStorage.getItem('issmart-assistCallSummary'))
    this.isExtractedDetails = JSON.parse(localStorage.getItem('issmart-assistExtractedDetails'))
    this.isLiveFeedback = JSON.parse(localStorage.getItem('issmart-assistLiveFeedback'))
    this.isSentiments = JSON.parse(localStorage.getItem('issmart-assistSentiments'))
    this.isLiveAudit = JSON.parse(localStorage.getItem('issmart-assistLiveAudit'))
  }

  callTranscriptOn(){
    localStorage.setItem('issmart-assistcallTranscript', String(this.iscallTranscript))
  }
  ProceduralGuidanceOn(){
    localStorage.setItem('issmart-assistProceduralGuidance', String(this.isProceduralGuidance))
  }
  CallSummaryOn(){
    localStorage.setItem('issmart-assistCallSummary', String(this.isCallSummary))
  }
  ExtractedDetailsOn(){
    localStorage.setItem('issmart-assistExtractedDetails', String(this.isExtractedDetails))
  }
  LiveFeedbackOn(){
    localStorage.setItem('issmart-assistLiveFeedback', String(this.isLiveFeedback))
  }
  SentimentsOn(){
    localStorage.setItem('issmart-assistSentiments', String(this.isSentiments))
  }
  LiveAuditOn(){
    localStorage.setItem('issmart-assistLiveAudit', String(this.isLiveAudit))
  }

}
