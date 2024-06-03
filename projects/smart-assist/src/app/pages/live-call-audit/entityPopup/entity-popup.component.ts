import { Component,Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CenterPopupService } from 'common_modules/services/center-popup.service';

@Component({
  selector: 'app-entity-popup',
  templateUrl: './entity-popup.component.html',
  styleUrls: ['./entity-popup.component.scss']
})
export class EntityPopupComponent implements OnInit {

  public type1: string = 'directive';
  modalForm : FormGroup;
  otherEntity:boolean = false;
  aiEntity:boolean = false;
  aiEntityData:any[] = [];
  copyContentBtn: boolean[] = new Array(this.aiEntityData.length).fill(false);

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private centerPopupService: CenterPopupService
  ) { }
  @Input() modalPopupObj: any;

  ngOnInit(): void {
    if(this.modalPopupObj.recordObj.type === 'entity'){
      this.aiEntityData = this.modalPopupObj.recordObj.entity;
      this.aiEntity = true;
    }else{
      this.popupResolve()
    }
  }

  popupResolve(){
    this.modalForm = this.formBuilder.group({
      value : [this.modalPopupObj.recordObj.text]
    })
    this.otherEntity = true;
  }
  public onScrollEvent(event: any): void {
    // console.log(event);
  }

  copyContent(content) {
    let entity = content.entity + ":" + content.text
    navigator.clipboard.writeText(entity);
    this.copyContentBtn[content.index] = true;
    setTimeout(() => {
      this.copyContentBtn[content.index] = false;
    }, 2000);
  }

  saveEntity() {
    // this.centerPopupService.resolveConfirm({othersData: 'hii'});
    this.toasterService.info('Your changes has been saved');
  }

  submitForm(){
    this.toasterService.info("Updated");
  }

}
