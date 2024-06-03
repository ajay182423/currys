import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'single-select-dropdown',
  templateUrl: './single-select-dropdown.component.html',
  styles: [
    `:host {
      display: inline-block;
      width: 100%;
    }`
  ]
})
export class SingleSelectDropdownComponent implements OnInit {

  @Input() label: string;
  @Input() selectedItem?: string;
  @Input() optionList: string[];
  @Output() valueChanged = new EventEmitter<string>();

  fieldRequiredError: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  requiredCheckOnSelectInput(dropDownValue) {
    if (dropDownValue === "0") {
      this.fieldRequiredError = true;
    } else {
      this.fieldRequiredError = false;
    }
    this.valueChanged.emit(dropDownValue); 
  }

}
