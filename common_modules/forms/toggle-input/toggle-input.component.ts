import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'toggle-input',
  templateUrl: './toggle-input.component.html',
  styles: [
    `:host {
      display: inline-block;
      width: 100%;
    }`
  ]
})
export class ToggleInputComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() customStyle?: string = '';
  @Input() isReadOnly: boolean = false;

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
