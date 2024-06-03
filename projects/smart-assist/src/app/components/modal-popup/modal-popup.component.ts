import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, AfterViewInit, Input, HostListener } from '@angular/core';
import { trigger, style, transition, animate, keyframes } from '@angular/animations';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { ModalPopupService } from '../../services/modal-popup.service';
// import { ModalPopupService } from 'common_modules/services/modal-popup.service';

@Component({
  selector: 'modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss'],
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
export class ModalPopupComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() modalPopupObj: any;
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
    private modalPopupService: ModalPopupService,
    private resolver: ComponentFactoryResolver
  ) { }


  ngOnInit(): void {
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
    if (this.popupComponentRef.instance.modalForm?.dirty) {
      Promise.resolve().then(async () => {
        if (await this.confirmDialogService.openConfirmDialog('Unsaved Changes', 'Are you sure you want to close without saving?', 'No', 'Yes')) {
          if (goBack)
            this.modalPopupService.closeOrGoToPreviousModalPopup();
          else
            this.modalPopupService.closeModalPopup();
        }
      });
    }
    else {
      if (goBack)
        this.modalPopupService.closeOrGoToPreviousModalPopup();
      else
        this.modalPopupService.closeModalPopup();
    }
  }

}
