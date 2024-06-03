import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: [],
})
export class PopupMenuComponent {

  @Input() menuItems: any[];
  @Input() showPopupMenu: boolean;
  @Input() customStyle?: any;
  @Output() popupMenuClick = new EventEmitter<any>();
  
  constructor(){}

  onPopupMenuClick(event, menuItem){
    if (menuItem.enabled){
      this.popupMenuClick.emit(menuItem);
    }
    event.stopPropagation();
  }
}
