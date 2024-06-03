import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalPopupService {

  modalPopupStatus: boolean;
  private modalPopupSource = new BehaviorSubject(null);
  modalPopup = this.modalPopupSource.asObservable();

  constructor() {
    this.modalPopupStatus = false;
  }

  //Modal Popup
  openModalPopup(param: any) {
    this.modalPopupStatus = param.openPopup;
    this.modalPopupSource.next(param)
  }

  isModalPopupOpened(): boolean {
    return this.modalPopupStatus;
  }

  closeOrGoToPreviousModalPopup() {
    let currentSource: any = this.modalPopupSource.value;
    if (currentSource?.previousPopup) {
      this.openModalPopup(currentSource.previousPopup);
    } else {
      this.modalPopupStatus = false;
      this.modalPopupSource.next({ openPopup: false });
    }
  }

  closeModalPopup() {
    this.modalPopupStatus = false;
    this.modalPopupSource.next({ openPopup: false });
  }

}
