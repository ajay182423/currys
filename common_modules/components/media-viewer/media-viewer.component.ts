import { Component, OnInit, Input } from '@angular/core';
import { MediaViewerService } from 'common_modules/services/media-viewer.service';

@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.scss'],
})
export class MediaViewerComponent implements OnInit {

  @Input() mediaViewerObj: any;

  constructor(
    private mediaViewerService: MediaViewerService,
  ) {}

  
  ngOnInit(): void {
  }
  
  closeViewer(){
    this.mediaViewerService.closeMediaViewer();
  }

}
