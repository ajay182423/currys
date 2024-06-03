import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { IJsonFormOptions } from 'common_modules/interfaces/json-form';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { FolderFileViewService } from 'common_modules/services/folder-file-view.service';
import { InputDialogService } from 'common_modules/services/input-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'folder-file-view',
  templateUrl: './folder-file-view.component.html',
  styleUrls: ['./folder-file-view.component.scss'],
})
export class FolderFileViewComponent implements OnInit, OnDestroy {

  @Input() isListLoading: boolean = false;
  @Input() mainTitle: string = '';
  @Input() otherTitle: string = '';
  @Input() folderFileList: any;
  @Input() fileUrl: string;
  @Input() folderSetupEndPoint: string;
  @Input() fileSetupEndPoint: string;
  @Input() showIcons?: boolean = false;
  selectedFilePathSubscription: Subscription;
  contextMenuEventSubscription: Subscription;
  selectedFilePath: any = "";

  constructor(
    private confirmDialogService: ConfirmDialogService,
    private inputDialogService: InputDialogService,
    private folderFileViewService: FolderFileViewService,
  ) { }

  ngOnDestroy(): void {
    if (this.selectedFilePathSubscription !== undefined) this.selectedFilePathSubscription.unsubscribe();
    if (this.contextMenuEventSubscription !== undefined) this.contextMenuEventSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.selectedFilePathSubscription = this.folderFileViewService.selectedFilePath.subscribe(data => {
      this.selectedFilePath = data?.filePath;
    });
    this.contextMenuEventSubscription = this.folderFileViewService.contextMenuClick.subscribe(data => {
      switch (data?.eventName) {
        case 'New File':
          this.createorRenameFolderOrFile('File', '', true);
          break;
        case 'New Folder':
          this.createorRenameFolderOrFile('Folder', '', true);
          break;
        case 'Rename':
          this.createorRenameFolderOrFile(data?.type, data?.name, false);
          break;
        case 'Delete':
          this.deleteFolderOrFile(data?.type, data?.name);
          break;
      }
    });
  }

  //#region - Popup create folder or file
  showCreateMenu: boolean = false;
  createMenuItems: any = {
    name: 'Create',
    items: [
      { id: 1, icon: 'folder', iconSize: '2rem', show: true, enabled: true, name: 'Folder' },
    { id: 2, icon: 'draft', iconSize: '2rem', show: true, enabled: true, name: 'File' }
    ]
  };

  openCreateMenu(e) {
    this.showCreateMenu = true;
    e.stopPropagation();
  }

  @HostListener('window:blur')
  @HostListener('document:click')
  public onDocumentClick(e) {
    if (this.showCreateMenu) {
      this.showCreateMenu = false;
    }
  }

  onPopupMenuClick($event) {
    this.showCreateMenu = false;
    this.createorRenameFolderOrFile($event.name, '', true)
  }

  createorRenameFolderOrFile(folderOrFile: string, name: string, isNewEntry: boolean) {
    const customform: IJsonFormOptions = {
      formHeading: (isNewEntry ? 'Create ' : 'Rename ') + folderOrFile,
      primaryAction: isNewEntry ? 'Create' : 'Rename',
      formControls: [
        { name: 'name', label: folderOrFile + ' Name', value: name, type: 'text', disabled: false, validators: { required: true } }
      ]
    };
    Promise.resolve().then(async () => {
      const formData = await this.inputDialogService.openInputDialog(customform);
      if (formData) {
        this.folderFileViewService.folderFileSetup(
          (folderOrFile === 'Folder') ? this.folderSetupEndPoint : this.fileSetupEndPoint,
          {
            action: isNewEntry ? 'Create' : 'Rename',
            name: formData.name,
            location: this.selectedFilePath,
            updatedBy: this.folderFileViewService.loggedInUserFullName
          }
        ).subscribe();
      }
    }).catch((error) => {
      console.warn("Error while creating " + folderOrFile + "!");
      console.error(error);
    });
  }
  //#endregion

  deleteFolderOrFile(folderOrFile: string, name: string) {
    Promise.resolve().then(async () => {
      if (await this.confirmDialogService.openConfirmDialog('Delete ' + folderOrFile, 'Are you sure you want to permanently delete ' + name + ' ' + folderOrFile.toLowerCase() + '?')) {
        this.folderFileViewService.folderFileSetup(
          (folderOrFile === 'Folder') ? this.folderSetupEndPoint : this.fileSetupEndPoint,
          {
            action: 'Delete',
            name: '',
            location: this.selectedFilePath,
            updatedBy: this.folderFileViewService.loggedInUserFullName
          }
        ).subscribe();
      }
    }).catch((error) => {
      console.warn("The given record could not be deleted!");
      console.error(error);
    });
  }

} ''