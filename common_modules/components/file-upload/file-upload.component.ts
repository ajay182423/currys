import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {

  @Input() options: any;
  @Output() onUploadFinished = new EventEmitter();
  progress: number;

  @ViewChild('fileSelect')
  fileSelect: ElementRef;
  
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit() {
  }

  getFileType(ext: string){
    let imageExts = ["image/jpg","image/jpeg","image/png"];
    if (imageExts.some(e => e === ext)){
      return "image";
    }
    else{
      let videoExts = ["video/mp4","video/webm","video/ogg"];
      if (videoExts.some(e => e === ext)){
        return "video";
      } 
      else{
        return "file";
      }
    }
  }
  
  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    //Check for extensions
    let validExt = this.options.allowedExtensions.some(e => e === fileToUpload.type);
    if (!validExt) {
      this.toastr.error(fileToUpload.type + " file type is not allowed");
      return;
    }
    //get file type
    let fileType = this.getFileType(fileToUpload.type);
    let maxFileSize = 0;
    if (fileType === "image"){
      maxFileSize = this.options.maxImageSize;
    } else if(fileType === "video"){
      maxFileSize = this.options.maxVideoSize;
    } else if(fileType === "file"){
      maxFileSize = this.options.maxFileSize;
    }
    //check file size
    if (fileToUpload.size >= (maxFileSize * (1024 * 1024))) {
      this.toastr.error("File size should not be more than " + maxFileSize + " MB");
      return;
    }
    const formData = new FormData();
    formData.append(this.options.pappName + '-files', fileToUpload, fileToUpload.name);

    this.http.post(this.options.fileUploadApi, formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          if (this.fileSelect?.nativeElement !== undefined)
            this.fileSelect.nativeElement.value = "";
          this.onUploadFinished.emit(event.body);
        }
        else{
          this.progress = 0;
        }
      });
  }

}
