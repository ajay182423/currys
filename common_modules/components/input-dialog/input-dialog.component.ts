import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IJsonFormControls, IJsonFormOptions } from "common_modules/interfaces/json-form";
import { InputDialogService } from "common_modules/services/input-dialog.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "input-dialog",
    outputs: ["valueEvents: value"],
    templateUrl: './input-dialog.component.html',
    styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialogComponent implements AfterViewInit {

    focusables = ["input", "select", "textarea"];
    formOptions!: IJsonFormOptions;
    modalForm: FormGroup = this.formBuilder.group({});
    private valueEvents: EventEmitter<any>;

    constructor(
        private elementRef: ElementRef,
        private toastrService: ToastrService,
        private formBuilder: FormBuilder,
        public inputDialogService: InputDialogService,
    ) {
        this.formOptions = this.inputDialogService.formOptions;
        this.createForm(this.inputDialogService.formOptions?.formControls);
        this.valueEvents = new EventEmitter();
    }

    //region - focus input
    ngAfterViewInit() {
        const input = this.elementRef.nativeElement.querySelector(
            this.focusables.join(",")
        );
        if (input) {
            input.select();
        }
    }
    //endRegion

    cancelPrompt(): void {
        this.valueEvents.emit(null);
    }

    createForm(controls: IJsonFormControls[]) {
        for (const control of controls) {
            const validatorsToAdd = [];
            for (const [key, value] of Object.entries(control.validators)) {
                switch (key) {
                    case 'min':
                        validatorsToAdd.push(Validators.min(value));
                        break;
                    case 'max':
                        validatorsToAdd.push(Validators.max(value));
                        break;
                    case 'required':
                        if (value) {
                            validatorsToAdd.push(Validators.required);
                        }
                        break;
                    case 'requiredTrue':
                        if (value) {
                            validatorsToAdd.push(Validators.requiredTrue);
                        }
                        break;
                    case 'email':
                        if (value) {
                            validatorsToAdd.push(Validators.email);
                        }
                        break;
                    case 'minLength':
                        validatorsToAdd.push(Validators.minLength(value));
                        break;
                    case 'maxLength':
                        validatorsToAdd.push(Validators.maxLength(value));
                        break;
                    case 'pattern':
                        validatorsToAdd.push(Validators.pattern(value));
                        break;
                    case 'nullValidator':
                        if (value) {
                            validatorsToAdd.push(Validators.nullValidator);
                        }
                        break;
                    default:
                        break;
                }
            }
            this.modalForm.addControl(
                control.name,
                this.formBuilder.control({ value: control.value, disabled: control.options?.disabled ? true : false }, validatorsToAdd)
            )
        }
    }

    processInput(): void {
        if (!this.modalForm.valid) {
            this.toastrService.error('Please fill the required fields first');
            return;
        }
        this.valueEvents.emit(this.modalForm.value);
    }

}