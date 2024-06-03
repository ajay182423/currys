import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'form-table',
  templateUrl: './form-table.component.html',
  styleUrls: ['./form-table.component.scss']
})
export class FormTableComponent implements OnInit, OnChanges {

  @Input() tableHeaders: any;
  @Input() tableData: any;
  @Input() enableRecordSelector?: boolean = true;
  @Input() enableRecordEditor?: boolean = false;
  @Input() isLoading?: boolean = false;
  @Output() selectionChanged = new EventEmitter<any>();
  @Output() rowClickEvent = new EventEmitter<any>();

  columnStartIndex: number = 1;
  totalRowsSelected: number = 0;
  allRowsSelected: boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.enableRecordSelector) {
      this.columnStartIndex = 2;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getTotalSelectedRows();
  }

  selectAllRows() {
    this.allRowsSelected = !this.allRowsSelected;
    this.tableData?.tableRows.forEach(element => {
      element[1].value = this.allRowsSelected;
    });
    this.getTotalSelectedRows();
  }

  sendEditRowRequest(id: any) {
    this.rowClickEvent.emit(id);
  }

  getTotalSelectedRows() {
    //count
    this.totalRowsSelected = 0;
    this.tableData?.tableRows?.forEach(element => {
      if (element[1].value) this.totalRowsSelected = this.totalRowsSelected + 1;
    });
    //act after counting
    if (this.totalRowsSelected === this.tableData?.tableRows?.length && this.tableData?.tableRows?.length > 0) {
      this.allRowsSelected = true;
    }
    else {
      this.allRowsSelected = false;
    }
    //send selection to parent
    let recordIds = [];
    this.tableData?.tableRows?.forEach(element => {
      if (element[1].value === true) recordIds.push(element[0].value);
    });
    this.selectionChanged.emit(recordIds);
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
