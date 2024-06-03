import { Injectable } from "@angular/core";
import { IJsonFormOptions } from "common_modules/interfaces/json-form";

export type InputDialogResult = any | null;

@Injectable({
	providedIn: "root"
})
export class InputDialogService {

    public formOptions: IJsonFormOptions;
	private promiseResolve: Function | null;
	private promiseReject: Function | null;

	constructor() {
        this.formOptions = {};
    	this.promiseReject = null;
		this.promiseResolve = null;
    }

	openInputDialog(formOptions: IJsonFormOptions): Promise<InputDialogResult> {
        if(this.isInputPending()) {
            throw(new Error(`There is already an active Input dialog`));
        }
        let promise = new Promise<InputDialogResult>((resolve, reject) => {
            this.formOptions = formOptions;
			this.promiseResolve = resolve;
			this.promiseReject = reject;
        });
        return( promise );
    }

    isInputPending(): boolean {
        return(!!this.promiseResolve);
    }

    resolveInput(value: InputDialogResult): void {
        if(!this.isInputPending()) {
            throw(new Error("There is no active Input dialog"));
        }
        this.promiseResolve(value);
        this.formOptions = {};
		this.promiseResolve = null;
		this.promiseReject = null;
    }

    resolveInputWithDefault(): void {
        this.resolveInput(null);
    }

}