import { Component, OnInit, Input, HostListener, ElementRef, Output, EventEmitter } from "@angular/core";
import { FolderFileViewService } from "common_modules/services/folder-file-view.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'folder-file-tree',
  templateUrl: './folder-file-tree.component.html',
  styleUrls: ['./folder-file-tree.component.scss'],
})
export class FolderFileTreeComponent implements OnInit {

  @Input() folderFileList: any;
  @Input() level?: number = 0;
  @Input() showIcons?: boolean = false;
  selectedFilePathSubscription: Subscription;
  selectedFilePath: string = "";

  constructor(
    private folderFileViewService: FolderFileViewService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.selectedFilePathSubscription = this.folderFileViewService.selectedFilePath.subscribe(data => {
      this.selectedFilePath = data?.filePath;
    });
  }

  openFolderOrFile(folderOrFile: string, filePath: string, fileName: string, fileId: number) {
    this.folderFileViewService.setSelectedFilePath(folderOrFile, filePath, fileName);
    if (folderOrFile === 'File')
      this.folderFileViewService.openFileOnClick(fileId, false);
  }

  openOrCloseFolder(filePath, isOpened) {
    if (!isOpened)
      this.folderFileViewService.addFolderPathToOpenedFolderList(filePath);
    else
      this.folderFileViewService.removeFolderPathFromOpenedFolderList(filePath);
  }

  //#region - Context menu
  contextMenu: { show: boolean, filePath: string, fileId: number, folderOrFile: string } = { show: false, filePath: "", fileId: 0, folderOrFile: "" };
  mousePosition = { x: 0, y: 0 };
  folderMenuItems: any = [
    { id: 1, icon: 'description', iconSize: '2.1rem', show: true, enabled: true, name: 'New File' },
    { id: 2, icon: 'folder', iconSize: '2.1rem', show: true, enabled: true, name: 'New Folder' },
    { id: 3, icon: 'drive_file_rename_outline', iconSize: '2.1rem', show: true, enabled: true, name: 'Rename' },
    { id: 4, icon: 'delete', iconSize: '2.1rem', show: true, enabled: true, name: 'Delete' },
  ];

  fileMenuItems: any = [
    { id: 1, icon: 'edit', iconSize: '2.1rem', show: true, enabled: true, name: 'Edit File' },
    { id: 2, icon: 'drive_file_rename_outline', iconSize: '2.1rem', show: true, enabled: true, name: 'Rename' },
    { id: 3, icon: 'delete', iconSize: '2.1rem', show: true, enabled: true, name: 'Delete' },
  ];

  @HostListener('document:contextmenu', ['$event'])
  public onDocumentRightClick(e) {
    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.contextMenu = { show: false, filePath: "", fileId: 0, folderOrFile: "" };
    }
  }

  @HostListener('window:blur')
  @HostListener('document:click')
  public onDocumentClick() {
    if (this.contextMenu.show) {
      this.contextMenu = { show: false, filePath: "", fileId: 0, folderOrFile: "" };
    }
  }

  onRowRightClick(e, filePath: string, fileId: number, fileName: string, folderOrFile: string) {
    e.preventDefault();
    this.folderFileViewService.setSelectedFilePath(folderOrFile, filePath, fileName);
    this.contextMenu = { show: true, filePath: filePath, fileId: fileId, folderOrFile: folderOrFile };
    this.mousePosition.x = e.clientX;
    this.mousePosition.y = e.clientY;
  }

  onContextMenuClick($event, isFolder: boolean, name: string) {
    if ($event.name === 'Edit File' && !isFolder) {
      this.folderFileViewService.openFileOnClick(this.contextMenu.fileId, true);
    } else {
      this.folderFileViewService.emitContextMenuClick({
        eventName: $event.name,
        type: isFolder ? 'Folder' : 'File',
        name: name, //file or folder name
      });
    }
    this.contextMenu = { show: false, filePath: "", fileId: 0, folderOrFile: "" };
  }
  //#endregion

}