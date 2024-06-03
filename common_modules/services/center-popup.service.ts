import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type CenterPopupPromiseResult = any;

@Injectable({
  providedIn: 'root'
})
export class CenterPopupService {

  modalPopupStatus: boolean;
  private modalPopupSource = new BehaviorSubject(null);
  modalPopup = this.modalPopupSource.asObservable();

  
  private promiseResolve: Function | null;
	private promiseReject: Function | null;

  constructor() {
    this.modalPopupStatus = false;
  }

  //Modal Popup
  openModalPopup(param: any) {
    if (param.isPromise){
      var promise = new Promise<CenterPopupPromiseResult>((resolve, reject) => {
        this.modalPopupStatus = param.openPopup;
        this.modalPopupSource.next(param)
        this.promiseResolve = resolve;
        this.promiseReject = reject;
      });
      return(promise);
    }
    else{
      this.modalPopupStatus = param.openPopup;
      this.modalPopupSource.next(param)
    }
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

  resolveConfirmWithDefault() : void {
    this.resolveConfirm('');
  }

  resolveConfirm(value: CenterPopupPromiseResult): void {
      
      this.promiseResolve(value);
      this.modalPopupStatus = false;
      this.modalPopupSource.next({ openPopup: false });
      this.promiseResolve = null;
      this.promiseReject = null;
  }

}
