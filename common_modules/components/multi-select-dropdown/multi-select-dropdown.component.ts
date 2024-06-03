import { Component, OnInit, HostListener, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { IMultiSelectDropDown } from 'common_modules/interfaces/multi-select-drop-down';

@Component({
  selector: 'multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent implements OnInit, DoCheck, AfterViewInit {

  @Input() label: string;
  @Input() controlSize?: string = 'r'; // r = regular , xl = large
  @Input() selectedItems?: string;
  @Input() optionList: IMultiSelectDropDown[];
  @ViewChild('selectedItemsContainer') selectedItemsContainer: ElementRef;
  selectedItemsWidth: string;
  showPopup: boolean = false;
  isItFirstTime: boolean = false;
  totalItemsChecked: number = 0;
  allItemsChecked: boolean = false;
  
  constructor() { }
 
  ngOnInit() {
  }

  ngDoCheck() {
    if(this.optionList !== undefined){
      this.updatedSelecteditems();
    }
  }
  
  ngAfterViewInit() {
  }

  openPopup(e:MouseEvent) {
    this.isItFirstTime = true;
    if (this.showPopup) {
      this.showPopup = false;
    }
    else{
      this.showPopup = true;
    }
  }
 
  @HostListener('document:click')
  public onDocumentClick() {
    if (this.showPopup && !this.isItFirstTime) {
      this.showPopup = false;
    }
    else{
      this.isItFirstTime = false;
    }
  }

  selectAll(e:MouseEvent){
    this.allItemsChecked = !this.allItemsChecked;
    this.optionList.forEach(item => {
      item.isSelected = this.allItemsChecked;
    });
    e.stopPropagation();
  }

  itemSelected(item,e:MouseEvent){
    item.isSelected = !item.isSelected;
    e.stopPropagation();
  }

  updatedSelecteditems(){
    this.totalItemsChecked =0;
    let selectedItems2 = "";
    this.optionList?.forEach(item => {
      if(item.isSelected){
        this.totalItemsChecked +=1;
        if(selectedItems2?.length < 1){
          selectedItems2 = item.name; 
        }
        else{
          selectedItems2 = selectedItems2 + ', ' + item.name; 
        }
      }
    });
    //if not selection then
    if(selectedItems2?.length < 1){
      this.selectedItems = "Choose " + this.label;
    }
    else{
      this.selectedItems = selectedItems2;
      if(this.totalItemsChecked === this.optionList.length && this.optionList.length > 0){
        this.allItemsChecked = true;
      }
      else{
        this.allItemsChecked = false;
      }
    }
  }

}
