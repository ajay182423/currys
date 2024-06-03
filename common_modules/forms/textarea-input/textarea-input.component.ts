import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'textarea-input',
  templateUrl: './textarea-input.component.html',
  styles: [
    `:host {
      display: inline-block;
      width: 100%;
    }`
  ]
})
export class TextareaInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() rows: string = "4";
  @Input() columns: string = "50";
  @Input() isReadOnly: boolean = false;zz

  constructor(@Self() public ngControl: NgControl) { 
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }
  
}
