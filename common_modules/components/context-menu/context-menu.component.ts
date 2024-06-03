import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: [],
})
export class ContextMenuComponent implements AfterViewInit {

  @Input() menuItems: any[];
  @Input() showContextMenu: boolean;
  @Input() mousePosition: { x: number, y: number } = { x: 0, y: 0 }
  @Output() contextMenuClick = new EventEmitter<any>();

  @ViewChild('contextMenu') contextMenu: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.setContextMenuPostion(this.contextMenu.nativeElement);
    this.changeDetectorRef.detectChanges();
  }

  onContextMenuClick(event, menuItem) {
    if (menuItem.enabled) {
      this.contextMenuClick.emit(menuItem);
    }
    event.stopPropagation();
  }

  setContextMenuPostion(contextMenu) {

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
