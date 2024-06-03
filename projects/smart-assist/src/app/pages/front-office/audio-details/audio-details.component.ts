import { Component, OnInit,Input,ChangeDetectorRef } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js';

@Component({
  selector: 'app-audio-details',
  templateUrl: './audio-details.component.html',
  styleUrls: ['./audio-details.component.scss']
})
export class AudioDetailsComponent implements OnInit {


  data : any = [];
  audioData: any = [];
  @Input() modalPopupObj: any;
  referenceData: any = [];
  wave: WaveSurfer = null;
  silenceData: any[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.data = this.modalPopupObj.recordId;
    let referenceLength = Object.keys(this.modalPopupObj.recordId.silence_reference).length;
    for(var i = 0; i < referenceLength; i++) {
      let startTime = this.convertToSeconds(this.modalPopupObj.recordId.silence_reference[i].start_time.split(":")[0],this.modalPopupObj.recordId.silence_reference[i].start_time.split(":")[1]);
      let endTime = this.convertToSeconds(this.modalPopupObj.recordId.silence_reference[i].end_time.split(":")[0],this.modalPopupObj.recordId.silence_reference[i].end_time.split(":")[1]);
      if((endTime - startTime) >= 3 ){
        this.referenceData.push(this.modalPopupObj.recordId.silence_reference[i]);
        this.silenceData.push({
          start : startTime,
          end : endTime,
          color : 'rgba(251,78,11,0.3)',
          loop : false,
          drag: false,
          resize: false
        })
      }
    }
    this.onPreviewPressed();
  }
  convertToSeconds(minutes, seconds){
    return  Number(minutes) * 60 + Number(seconds);
  }

  onPreviewPressed(): void {
    if (!this.wave) {
      this.generateWaveform();
    }
    this.cdr.detectChanges();
    Promise.resolve().then(() => this.wave.load(this.modalPopupObj.res));
  }
  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#5c5a5a',
        barHeight:  2,
        height:     90,
        progressColor: '#1954d1',
        cursorColor: 'hsl(0, 0%, 67%)',
        scrollParent: false,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline'
          }),
          Regions.create({
            regions: this.silenceData,
          }),
        ]
      });
      this.wave.enableDragSelection(false);
      this.wave.on('ready', () => {
        this.wave.stop();
      });
    });
  }

}
