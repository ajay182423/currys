import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'common_modules/services/helper.service';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'projects/smart-assist/src/app/services/account.service';
import { CustomerService } from 'projects/smart-assist/src/app/services/settings/customer.service';
import { slideUp } from 'common_modules/animations/page-animation';

@Component({
  selector: 'app-reference-popup',
  templateUrl: './reference-popup.component.html',
  styleUrls: ['./reference-popup.component.scss'],
  animations: [slideUp],
  styles: []
})
export class ReferencePopupComponent implements OnInit {

  @Input() modalPopupObj: any;
  htmlObj : any
  isRecordLoading:boolean = false;

  constructor(
    private toastrService: ToastrService,
    private helperService: HelperService,
    private accountService: AccountService,
    private CustomerService: CustomerService,
    private modalPopupService: ModalPopupService,
    private confirmDialogService: ConfirmDialogService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    document.getElementById("responseText").innerHTML = this.modalPopupObj.recordId;

    var allElementLink = document.querySelectorAll('a');

    for (var i = 0; i < allElementLink.length; i++) {
        allElementLink[i].addEventListener('click', function(event) {
          event.preventDefault();
          let get_id = this.getAttribute('href').slice(1)
          console.log(get_id)
          document.getElementById(get_id).scrollIntoView();
        });
      }
    }

    scrollToTop() {
        document.getElementById('top').scrollIntoView();
    }




}
