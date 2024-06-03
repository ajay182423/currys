import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'full-page-table',
  templateUrl: './full-page-table.component.html',
  styleUrls: ['./full-page-table.component.scss']
})
export class FullPageTableComponent implements OnInit {

  //Use 1,2,3 as key while passing tableRows...start with 1 if table is without action
  //first key - 0 value pair will only be used to action
  //assign the id/record_id value to key 0 if want to add action to each row. it will not be printed on the table.
  @Input() tableHeaders: any;
  @Input() tableData: any;
  @Input() hasFilter: boolean = false;
  @Input() customWidthClass?: string ;
  @Input() enableFooter: boolean = true;
  @Input() applyCustomWidth?: boolean = false;
  @Input() ContextMenuItems?: any;
  @Input() recordSelector?: any;
  @Input() enableRowRightClick?: boolean = false;
  @Input() isLoading?: boolean = false;
  @Input() tableMessage?: any;
  @Output() rowClickEvent = new EventEmitter<any>();
  @Output() pageChangeEvent = new EventEmitter<any>();
  @Output() primaryActionEvent = new EventEmitter<any>();
  @Output() secondaryActionEvent = new EventEmitter<any>();

  columnStartIndex: number = 0;
  allRecordsChecked: boolean = false;
  totalRecordsSelected: number = 0;

  constructor(
    private scroll: ViewportScroller,
    private elementRef: ElementRef
  ) { }

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }

  ngOnInit(): void {
    if (this.recordSelector?.isActive) {
      this.columnStartIndex = 1;
    }
  }

  selectAllRecords() {
    this.allRecordsChecked = !this.allRecordsChecked;
    this.tableData.tableRows.forEach(element => {
      element[1].value = this.allRecordsChecked;
    });
    this.getTotalSelectedRecordsCount();
  }

  selectRecord($event) {
    $event.stopPropagation();
  }

  deselectRecords() {
    this.tableData.tableRows.forEach(element => {
      element[1].value = false;
    });
    this.getTotalSelectedRecordsCount();
  }

  getTotalSelectedRecordsCount() {
    this.totalRecordsSelected = 0;
    this.tableData.tableRows.forEach(element => {
      if (element[1].value === true) this.totalRecordsSelected = this.totalRecordsSelected + 1;
    });
  }

  getSelectedRecordsIds(): any {
    let recordIds = [];
    this.tableData.tableRows.forEach(element => {
      if (element[1].value === true) recordIds.push(element[0].value);
    });
    return recordIds;
  }

  sendPrimaryActionRequest() {
    if (this.totalRecordsSelected > 0)
      this.primaryActionEvent.emit(this.getSelectedRecordsIds());
  }

  sendSecondaryActionRequest() {
    if (this.totalRecordsSelected > 0)
      this.secondaryActionEvent.emit(this.getSelectedRecordsIds());
  }

  sendRowClickRequest(row) {
    //If right click is enabled then it means we are using left click to open a sub page
    if (this.enableRowRightClick) {
      this.rowClickEvent.emit(row);
    } else {
      this.rowClickEvent.emit(row[0].value);
    }
  }

  sendPageChangeRequest(pageNo: any) {
    if (pageNo) {
      this.pageChangeEvent.emit(pageNo);
    }
    this.scroll.scrollToPosition([0, 0]);
  }

  //Pagination
  goToPreviousPage() {
    if (this.tableData?.currentPage > 1) {
      this.pageChangeEvent.emit(this.tableData?.currentPage - 1);
      this.scroll.scrollToPosition([0, 0]);
    }
  }

  goToNextPage() {
    if (this.tableData?.currentPage < this.tableData.totalPages) {
      this.pageChangeEvent.emit(this.tableData?.currentPage + 1);
      this.scroll.scrollToPosition([0, 0]);
    }

  }

  sortTableRows(element: any) {
    const sort = new Sort();
    this.tableHeaders.forEach(item => {
      if (item === element) {
        if (element.order === 'desc') {
          item.order = 'asc';
          item.class = 'th-sort-asc';
        }
        else {
          item.order = 'desc';
          item.class = 'th-sort-desc';
        }
      }
      else {
        item.order = 'desc';
        item.class = 'th-sort';
      }
    });
    this.tableData.tableRows.sort(sort.startSort(element.id, element.order, element.type));
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
    if (this.enableRowRightClick) {
      e.preventDefault();
      this.contextMenu = { show: true, recordId: recordId };
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    }
  }

  onContextMenuClick($event, recordId?: any) {
    this.contextMenu = { show: false, recordId: 0 };
    if ($event.name === 'Edit') {
      this.rowClickEvent.emit({eventType: 'Edit', recordId: recordId});
    }
  }
  //#endregion

}

class Sort {

  private sortOrder = 1;
  private collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  constructor() { }

  public startSort(property, order, type = "") {
    if (order === 'desc') this.sortOrder = -1;
    else this.sortOrder = 1;
    return (a, b) => {
      if (type === 'date') {
        return this.sortData(new Date(a[property].value), new Date(b[property].value));
      }
      else {
        return this.collator.compare(a[property].value, b[property].value) * this.sortOrder;
      }
    }
  }

  private sortData(a, b) {
    if (a < b) {
      return -1 * this.sortOrder;
    } else if (a > b) {
      return 1 * this.sortOrder;
    } else {
      return 0 * this.sortOrder;
    }
  }

}
