import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ISingleFolderList } from 'common_modules/interfaces/single-folder-list';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';

@Component({
  selector: 'single-folder-view',
  templateUrl: './single-folder-view.component.html',
  styleUrls: ['./single-folder-view.component.scss'],
})
export class SingleFolderViewComponent implements OnInit {

  @Input() isListLoading: boolean = false;
  @Input() mainTitle: string = '';
  @Input() otherTitle: string = '';
  @Input() folderList: ISingleFolderList[] = [];
  @Input() fileUrl: string;
  @Input() selectedFolderId?: number = 0;
  @Input() folderSetupComponent: any;
  @Output() openFolderEvent = new EventEmitter<any>();

  constructor(
    private elementRef: ElementRef,
    private modalPopupService: ModalPopupService
  ) { }

  ngOnInit(): void {
  }

  openFolderList(folderId: number, folderName: string) {
    this.openFolderEvent.emit({folderId: folderId, folderName: folderName});
  }

  openFolderSetupPopup(recordId: any, isNewEntry: boolean) {
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: recordId,
      isNewEntry: isNewEntry,
      popupPosition: 'right',
      heading: this.otherTitle + ' Setup',
      width: '55rem',
      popup: this.folderSetupComponent
    });
  }

  //#region - Context menu
  contextMenu: { show: boolean, recordId: number } = { show: false, recordId: 0 };
  mousePosition = { x: 0, y: 0 };
  menuItems: any = [
    { id: 1, icon: 'drive_file_rename_outline', iconSize: '2.1rem', show: true, enabled: true, name: 'Edit' },
  ];

  @HostListener('document:contextmenu', ['$event'])
  public onDocumentRightClick(e) {
    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.contextMenu = { show: false, recordId: 0 };
    }
  }

  @HostListener('window:blur')
  @HostListener('document:click')
  public onDocumentClick() {
    if (this.contextMenu.show) {
      this.contextMenu = { show: false, recordId: 0 };
    }
  }

  onRowRightClick(e, recordId?: any) {
    e.preventDefault();
    this.contextMenu = { show: true, recordId: recordId };
    this.mousePosition.x = e.clientX;
    this.mousePosition.y = e.clientY;
  }

  onContextMenuClick($event, recordId?: any) {
    this.contextMenu = { show: false, recordId: 0 };
    if ($event.name === 'Edit') {
      this.openFolderSetupPopup(recordId, false);
    }
  }
  //#endregion

}
