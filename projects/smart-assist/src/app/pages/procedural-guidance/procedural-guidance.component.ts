import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { slideUp } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { CallAuditService } from 'projects/smart-assist/src/app/services/pages/call-audit.service';
import { finalize } from 'rxjs/operators';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service';
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { saveAs } from 'file-saver';
import { ReferencePopupComponent } from './reference-popup/reference-popup.component';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';

@Component({
  selector: 'procedural-guidance',
  templateUrl: './procedural-guidance.component.html',
  styleUrls: ['./procedural-guidance.component.scss'],
  animations: [slideUp],
  providers: [DatePipe]
})
export class ProceduralGuidanceComponent implements OnInit {

  isLoading: boolean = false;
  tableMessage: any = {};
  pageNumber: number = 1;
  pageSize: number = environment.pageSize;
  transactionId1:any;
  id : number;
  response: any;
  modalForm: FormGroup;
  isRecordLoading: boolean;
  agentId:any = 0;
  question = new FormControl('')
  questionText :string = '';
  responseData: any;
  responseText: any;
  referenceText: any;


  constructor(
    private AuditRecordsService: AuditRecordsService,
    private CallAuditService: CallAuditService,
    private modalPopupService: ModalPopupService,
    private datePipe: DatePipe,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.AuditRecordsService.isUpdating$.subscribe(x => this.tableMessage = { isUpdating: true, text:x });
    // this.isLoading = true;
    // this.modalForm = this.formBuilder.group({

    // });
  }




  download() {





    let link = document.createElement('a');
// link.download = 'hello.txt';
    var blob = new Blob([this.referenceText], {type: "text/html;charset=utf-8"});

// link.href = URL.createObjectURL(blob);
// link.target = "_blank";

let _url = URL.createObjectURL(blob);

window.open(_url, "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840))

// link.click();

URL.revokeObjectURL(link.href);
    // saveAs(blob, "reference.html");
    // saveAs(blob, "reference.html");

    // console.log(blob)
  }

  submitForm() {
    // Shaowing loader while data comes
    this.isLoading = true;

    // checking the form value exist
    if(this.question.value) {

      // Assigning the question text
      this.questionText = this.question.value

      // Calling the API by passing question
      this.CallAuditService.getProceduralData(this.question.value).subscribe(data => {
        console.log(data);
        this.responseData = data.sources;
        // this.responseText =  data.response;
        this.referenceText = `
                                  <style>
                                      .container {
                                        max-width:800px;
                                        width:90%;
                                        margin:0 auto
                                      }
                                    a {
                                      color: #311B92;
                                      font-weight: 500;
                                    }
                                    h2 {
                                        font-weight: 600;
                                        color: #757575;
                                    }
                                    h3 {
                                        color: #7B1FA2;
                                        font-weight: 600;
                                    }
                                    h4 {
                                        color: #F57C00;
                                    }
                                    img {
                                        margin: 0 auto;
                                        display: block;
                                        max-width: 100%;
                                    }
                                    ul {
                                        margin: 0;
                                        padding: 0;
                                        list-style: none;
                                        padding-left: 10px;
                                    }
                                    li {
                                        position: relative;
                                        padding-left: 20px;
                                    }
                                    li:before {
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
                                      + data.source +
                                    `</div>`;
        document.getElementById("responseText").innerText = data.response;
        // document.getElementById("referenceText").innerText = data.reference_text;
        // Hiding loader while data rendered
        this.isLoading = false;
      })
    }
    else {
      // Showing error message on submitting blank form
      this.toastrService.error('Please enter the question!')
    }

  }

  openPopup(text:any) {
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
      this.openReferencePopup(sourceText)
  }

  openReferencePopup(val:any){
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: val,
      popupPosition: 'centre',
      heading: 'Reference Text',
      width:'50vw',
      height: '65vh',
      popup: ReferencePopupComponent
    });
  }


}
