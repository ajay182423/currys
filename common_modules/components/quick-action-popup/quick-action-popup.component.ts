import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'quick-action-popup',
  templateUrl: './quick-action-popup.component.html',
  styleUrls: [],
})
export class QuickActionPopupComponent implements AfterViewInit {

  @Input() menuItems: any[];
  @Input() showQuickActionPopup: boolean;
  @Input() xyPosition: { x: number, y: number } = { x: 0, y: 0 }
  @Output() quickActionClick = new EventEmitter<any>();

  @ViewChild('quickAction') quickAction: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.setQuickActionPopupPostion(this.quickAction.nativeElement);
    this.changeDetectorRef.detectChanges();
  }

  onQuickActionClick(event, menuItem) {
    if (menuItem.enabled) {
      this.quickActionClick.emit(menuItem);
    }
    event.stopPropagation();
  }

  setQuickActionPopupPostion(contextMenu) {

    let menuDimension: any = {};

    menuDimension.x = contextMenu.offsetWidth;
    menuDimension.y = contextMenu.offsetHeight;

    if (this.mousePosition.x + menuDimension.x > window.innerWidth + window.scrollX) {
      this.mousePosition.x = this.mousePosition.x - menuDimension.x;
    } else {
      this.mousePosition.x = this.mousePosition.x;
    }

    if (this.mousePosition.y + menuDimension.y > window.innerHeight + window.scrollY) {
      this.mousePosition.y = this.mousePosition.y - menuDimension.y;
    } else {
      this.mousePosition.y = this.mousePosition.y;
    }
  }
}
