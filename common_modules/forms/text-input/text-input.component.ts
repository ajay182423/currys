import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styles: [
    `:host {
      display: inline-block;
      width: 100%;
    }`
  ]
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() isVerified: boolean = false
  @Input() placeHolder?: string = "";
  @Input() type?: string = 'text';
  @Input() isReadOnly: boolean = false;
  @Input() backgroundColor: string = '';
  @Input() blinker: boolean;

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
