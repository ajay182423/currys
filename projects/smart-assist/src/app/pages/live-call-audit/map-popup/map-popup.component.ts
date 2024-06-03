import { Component,Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
// import { HelperService } from 'common_modules/services/helper.service';
import { ToastrService } from 'ngx-toastr';
// import { environment } from 'projects/tapestry/src/environments/environment';

@Component({
  selector: 'app-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent implements OnInit {


  public type1: string = 'directive';
  modalForm : FormGroup 
  responsiveOptions: any[];
  items: any[];
  val: number = 3;
  

products: any[] ; 
loadGallery = false
trustedUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToastrService, 
    private sanitizer: DomSanitizer
  ) { 
 
   
  }
  @Input() modalPopupObj: any;

  ngOnInit(): void { 
    console.log(this.modalPopupObj.recordId)  
    // this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(this.modalPopupObj.recordId);  
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.modalPopupObj.recordId);  
  }

  
 
 

  

}
