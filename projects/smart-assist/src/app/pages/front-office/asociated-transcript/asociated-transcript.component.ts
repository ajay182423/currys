import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { HelperService } from 'common_modules/services/helper.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';

@Component({
  selector: 'app-asociated-transcript',
  templateUrl: './asociated-transcript.component.html',
  styleUrls: ['./asociated-transcript.component.scss']
})
export class AsociatedTranscriptComponent implements OnInit {

  @Input() modalPopupObj: any;
  transcriptData:any[]=[];
  modalForm: FormGroup[] = [];
  showTable:boolean= true;
  showTableForm:boolean = false;
  formIndex:number;
  showAddNewButton:boolean = false;
  showEditButton:boolean = true;
  showCancelButton:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private modalPopupService: ModalPopupService,
  ) { }

  ngOnInit(): void {
    this.transcriptShow();
  }

  transcriptShow(){
    this.transcriptData = this.modalPopupObj.recordId.val.otherProperties;
    this.formIndex = this.modalPopupObj.recordId.index;
  }
  showTableUi(){
    this.showTable = true;
    this.showTableForm = false;
    this.showCancelButton = false;
    this.showEditButton = true;
  }
  showForm(){
    this.showEditButton = false;
    this.showCancelButton = true;
    this.showTable = false;
    this.showTableForm = true;
    this.showAddNewButton = true;
    if(this.showTableForm){
      this.transcriptData.forEach((data, index) =>{
        this.modalForm[index] = this.formBuilder.group({
          startTime: data.start_Time,
          endTime: data.end_Time,
          associatedTrans: data.comment,
          speaker: data.speaker
        })
      })
    }
  }

  submitForm() {
    this.helperService.setFormData(this.modalForm, this.formIndex)
    this.modalPopupService.closeOrGoToPreviousModalPopup();
  }

  addRow() {
    let i = 0;
      this.transcriptData.push({
        startTime: '',
        endTime: '',
        associatedTrans: '',
      }
    )
    this.showForm();
    i++;
  }

}
