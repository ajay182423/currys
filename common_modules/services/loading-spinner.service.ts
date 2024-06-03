import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {

  private isLoadingSource = new BehaviorSubject(null);
  isLoading = this.isLoadingSource.asObservable();

  constructor() { }

  getIsLoadingStatus(componentName: string): boolean {
    return (componentName === this.isLoadingSource.value);
  }

  show(componentName: string) {
    this.isLoadingSource.next(componentName);
  }

  hide() {
    this.isLoadingSource.next(null);
  }

}
