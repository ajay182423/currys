import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';
import { slideUp } from 'common_modules/animations/page-animation';
import { environment } from 'projects/smart-assist/src/environments/environment';
import { finalize } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { NavbarService } from 'common_modules/services/navbar.service';
import { FolderFileViewService } from 'common_modules/services/folder-file-view.service';
import { Subscription } from 'rxjs';
import { IFileInfoAndContent } from 'common_modules/interfaces/folder-file-view';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'help-doc',
  templateUrl: './help-doc.component.html',
  styleUrls: ['./help-doc.component.scss'],
  animations: [slideUp],
  providers: [DatePipe]
})
export class HelpDocComponent implements OnInit, OnDestroy {

  helpTopicRecord: IFileInfoAndContent;
  isLoading: boolean = false;
  isHelpDocListLoading: boolean = true;
  helpDocList: any = [];
  fileUrl: string = environment.fileUrl;
  helpDocApiBaseUrl: string = environment.apiUrl + 'help/';
  pageTitle: string = 'Help';
  editFile: boolean = false;
  openFileSubscription: Subscription;
  @ViewChild('helpDocElement') helpDocElement: ElementRef;

  constructor(
    private modalPopupService: ModalPopupService,
    private titleService: Title,
    private datePipe: DatePipe,
    private navbarService: NavbarService,
    private folderFileViewService: FolderFileViewService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    const user = this.accountService.getCurrentUserValue();
    this.folderFileViewService.loggedInUserFullName = user.firstName + " " + user.lastName;
    this.folderFileViewService.refreshNeeded$.subscribe(() => this.getHelpDocList());
    this.openFileSubscription = this.folderFileViewService.openFile.subscribe(data => {
      if (data) this.constructHelpDoc(data);
    });
  }

  ngOnDestroy() {
    if (this.openFileSubscription !== undefined) this.openFileSubscription.unsubscribe();
  }

  getHelpDocList() {
    this.isLoading = true;
    this.folderFileViewService.getFolderFileList(
      this.helpDocApiBaseUrl + 'help-docs',
      this.folderFileViewService.openedFolderList).pipe(finalize(() => { this.isHelpDocListLoading = false; })).subscribe(data => {
        if (data[0]?.children?.length > 0) {
          console.log(data[0]?.children);
          this.helpDocList = data[0]?.children;
          this.pageTitle = data[0].name;
          this.titleService.setTitle(data[0].name + ' | Help - ' + environment.appName.part1 + ' ' + environment.appName.part2);
          //this.helpDocService.refreshNeeded$.subscribe(() => this.constructHelpDoc(data[0].id));
        } else {
          this.titleService.setTitle('No Help | Help - ' + environment.appName.part1 + ' ' + environment.appName.part2);
          //this.folderFileViewService.refreshNeeded$.subscribe(() => this.constructHelpDoc(0));
        }
      });
  }

  constructHelpDoc(fileData: any) {
    this.isLoading = true;
    this.folderFileViewService.getFileInfoAndContent(this.helpDocApiBaseUrl + 'help-doc/' + fileData.fileId).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(response => {
      this.helpTopicRecord = null;
      this.pageTitle = 'Help';
      this.editFile = false;
      this.createMenuItems = { name: 'Add', items: [] };
      if (response) {
        this.helpTopicRecord = response;
        this.pageTitle = response.name;
        if (fileData.editFile) {
          this.editFile = fileData.editFile;
          this.createMenuItems = {
            name: 'Add',
            items: [
              { id: 'bold', icon: 'format_bold', iconSize: '2rem', show: true, enabled: true, name: 'Bold' },
              { id: 'italic', icon: 'format_italic', iconSize: '2rem', show: true, enabled: true, name: 'Italic' },
              { id: 'underline', icon: 'format_underlined', iconSize: '2rem', show: true, enabled: true, name: 'Underline' },
              { id: 'title', icon: 'title', iconSize: '2rem', show: true, enabled: true, name: 'Title' },
              { id: 'paragraph', icon: 'segment', iconSize: '2rem', show: true, enabled: true, name: 'Paragraph' },
              { id: 'bullets', icon: 'format_list_bulleted', iconSize: '2rem', show: true, enabled: true, name: 'Bullets' },
              { id: 'numbering', icon: 'format_list_numbered', iconSize: '2rem', show: true, enabled: true, name: 'Numbering' },
              { id: 'hyperlink', icon: 'add_link', iconSize: '2rem', show: true, enabled: true, name: 'Hyperlink' },
              { id: 'table', icon: 'table', iconSize: '2rem', show: true, enabled: true, name: 'Table' },
              { id: 'image', icon: 'image', iconSize: '2rem', show: true, enabled: true, name: 'Image' },
              { id: 'video', icon: 'smart_display', iconSize: '2rem', show: true, enabled: true, name: 'Video' },
              { id: 'impNote', icon: 'error', iconSize: '2rem', show: true, enabled: true, name: 'Important note' },
              { id: 'clearAll', icon: 'delete_forever', iconSize: '2rem', show: true, enabled: true, name: 'Clear all' }
            ]
          };
        }
      }
    });
  }

  //Edit help doc
  createMenuItems: any = { name: 'Add', items: [] };

  checkTextSelection(){
    if (window.getSelection().toString().length > 0) {
      const range = window.getSelection().getRangeAt(0);
      const selectionPosition = range.getBoundingClientRect();
    }
  }

  receiveCreateMenuRequest($event) {
    switch ($event) {
      case '':
        //code
        break;
      case '':
        //code
        break;
    }
  }

  receiveSaveButtonRequest($event) {
    this.helpTopicRecord.updatedBy = this.folderFileViewService.loggedInUserFullName;
    this.helpTopicRecord.content = this.helpDocElement.nativeElement.innerHTML;
    this.folderFileViewService.updateFileInfoAndContent(
      this.helpDocApiBaseUrl + 'help-doc/',
      this.helpTopicRecord
    ).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(response => {
      this.constructHelpDoc({ fileId: response.id, editFile: false });
    });
  }
}
