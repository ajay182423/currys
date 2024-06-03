import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaViewerService {

  mediaViewerStatus: boolean;
  private mediaViewerSource = new BehaviorSubject(null);
  mediaViewer = this.mediaViewerSource.asObservable();

  constructor() {
    this.mediaViewerStatus = false;
  }

  //Media Viewer
  openMediaViewer(param: any) {
    this.mediaViewerStatus = param.openViewer;
    this.mediaViewerSource.next(param)
  }

  isMediaViewerOpened(): boolean {
    return this.mediaViewerStatus;
  }
  
  closeMediaViewer() {
    this.mediaViewerStatus = false;
    this.mediaViewerSource.next({ openViewer: false});
  }

}
