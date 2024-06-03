import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFileInfoAndContent, IFolderFileSetup } from 'common_modules/interfaces/folder-file-view';
import { IUser } from 'common_modules/interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FolderFileViewService {

  openedFolderList: string[] = [];
  loggedInUserFullName: string;

  private selectedFilePathSource = new BehaviorSubject<any>(null);
  selectedFilePath = this.selectedFilePathSource.asObservable();

  private contextMenuClickSource = new BehaviorSubject<any>(null);
  contextMenuClick = this.contextMenuClickSource.asObservable();

  private openFileSource = new BehaviorSubject<any>(null);
  openFile = this.openFileSource.asObservable();

  public isUpdating$ = new BehaviorSubject(null);

  public refreshNeeded$ = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) { }

  openFileOnClick(fileId: number, editFile: boolean) {
    this.openFileSource.next({ fileId: fileId, editFile: editFile });
  }

  setSelectedFilePath(folderOrFile: string, filePath: string, fileName: string) {
    this.selectedFilePathSource.next({
      folderOrFile: folderOrFile, 
      filePath: filePath, 
      fileName: fileName
    });
  }

  emitContextMenuClick(clickItemObj: any) {
    this.contextMenuClickSource.next(clickItemObj);
  }

  addFolderPathToOpenedFolderList(folderPath: string){
    this.openedFolderList.push(folderPath);
  }

  removeFolderPathFromOpenedFolderList(folderPath: string){
    const index = this.openedFolderList.indexOf(folderPath); 
    if (index > -1) {
      this.openedFolderList.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  public getFileInfoAndContent(endPoint: string): Observable<IFileInfoAndContent> {
    return this.httpClient.get<IFileInfoAndContent>(endPoint);
  }

  public updateFileInfoAndContent(endPoint: string, fileInfoAndContentObj: IFileInfoAndContent): Observable<any> {
    return this.httpClient.put<IFileInfoAndContent>(endPoint, fileInfoAndContentObj);
  }

  public getFolderFileList(endPoint: string, openedFolders: string[]): Observable<any> {
    return this.httpClient.post<any>(endPoint, { openedFolders: openedFolders });
  }

  public folderFileSetup(endPoint: string, folderSetupObj: IFolderFileSetup){
    this.isUpdating$.next('Updating');
    return this.httpClient.post(endPoint , folderSetupObj).pipe(
      tap(() => { this.isUpdating$.next('Updated successfully. Refreshing'); this.refreshNeeded$.next(true); }),
      catchError((err) => { this.isUpdating$.next(''); throw ''; })
    );
  }

}