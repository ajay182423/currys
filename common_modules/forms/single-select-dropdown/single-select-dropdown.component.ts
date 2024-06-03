import { Component, Input, Output, EventEmitter, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

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
export class SingleSelectDropdownComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() optionList: any;
  @Input() showDefaultOption?: boolean = false;
  @Input() defaultOption?: any = { id: 0, name: 'Select' };
  @Input() isRequired?: boolean = true;
  @Input() customClass="{}"
  @Output() onChanged = new EventEmitter<string>();
  @Output() onBlurred = new EventEmitter<string>();

  fieldRequiredError: boolean = false;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  // requiredCheckOnSelectInput(dropDownValue) {
  //   if (dropDownValue === 0 && this.isRequired) {
  //     this.fieldRequiredError = true;
  //   } else {
  //     this.fieldRequiredError = false;
  //   }
  //   this.onChanged.emit(dropDownValue);
  // }

  requiredCheckOnChangeInput(dropDownValue) {
    if (dropDownValue == 0 && this.isRequired) {
      this.fieldRequiredError = true;
    } else {
      this.fieldRequiredError = false;
    }
    this.onChanged.emit(dropDownValue);
  }

  requiredCheckOnBlurInput(dropDownValue) {
    if (dropDownValue == 0 && this.isRequired) {
      this.fieldRequiredError = true;
    } else {
      this.fieldRequiredError = false;
    }
    this.onBlurred.emit(dropDownValue);
  }

}
