import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, AfterViewInit, Input, HostListener,EventEmitter } from '@angular/core';
import { trigger, style, transition, animate, keyframes } from '@angular/animations';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { CenterPopupService } from 'common_modules/services/center-popup.service';

@Component({
  selector: 'center-popup',
  templateUrl: './center-popup.component.html',
  outputs: ["valueEvents: value"],
  styleUrls: ['./center-popup.component.scss'],
  animations: [

    trigger('centerModalSlideIn', [

      transition(":enter", [
        animate('.3s ease', keyframes([
          style({ opacity: 0, transform: 'translateX(10%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0%)', offset: 1.0 }),
        ]))
      ]),
      transition(":leave", [
        animate('.5s ease', keyframes([
          style({ opacity: 1, transform: 'translateX(0%)', offset: 0 }),
          style({ opacity: 0, transform: 'translateX(10%)', offset: 1.0 }),
        ]))
      ])

    ]),

  ]
})
export class CenterPopupComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() modalPopupObj: any;
  private valueEvents: EventEmitter<string>;
  show: boolean = false;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.popupComponentRef.instance.modalForm?.dirty) {
      $event.returnValue = true;
    }
  }

  @ViewChild('popupContent', { read: ViewContainerRef }) popupContent: ViewContainerRef;
  popupComponentRef: any;

  constructor(
    private confirmDialogService: ConfirmDialogService,
    private centerPopupService: CenterPopupService,
    private resolver: ComponentFactoryResolver
  ) {
    this.valueEvents = new EventEmitter();
  }


  ngOnInit(): void {
    console.log('center poup')
  }

  ngOnDestroy() {
    if (this.popupComponentRef) this.popupComponentRef.destroy();
  }

  ngAfterViewInit() {
    this.createModalPopupContent(this.modalPopupObj);
  }

  //Create modal popup
  createModalPopupContent(modalPopupObj: any) {
    if (this.popupContent) {
      this.popupContent.clear();
      const factory = this.resolver.resolveComponentFactory(modalPopupObj.popup);
      this.popupComponentRef = this.popupContent.createComponent(factory);
      this.popupComponentRef.instance.modalPopupObj = modalPopupObj;
    }
  }

  closePopup(goBack: boolean) {
    if (this.modalPopupObj.isPromise){
      this.valueEvents.emit("");
    }
    else{
      if (this.popupComponentRef.instance.modalForm?.dirty) {
        Promise.resolve().then(async () => {
          if (await this.confirmDialogService.openConfirmDialog('Unsaved Changes', 'Are you sure you want to close without saving?', 'No', 'Yes')) {
            if (goBack)
              this.centerPopupService.closeOrGoToPreviousModalPopup();
            else
              this.centerPopupService.closeModalPopup();
          }
        });
      }
      else {
        if (goBack)
          this.centerPopupService.closeOrGoToPreviousModalPopup();
        else
          this.centerPopupService.closeModalPopup();
      }
    }
  }

}
