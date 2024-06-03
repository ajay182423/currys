import { Injectable } from "@angular/core";

export type ConfirmDialogResult = boolean;

@Injectable({
	providedIn: "root"
})
export class ConfirmDialogService {

    public heading: string;
	public message: string;
    public secondaryAction: string;
    public primaryAction: string;
    private promiseResolve: Function | null;
	private promiseReject: Function | null;

	constructor() {
        this.heading = "";
    	this.message = "";
        this.secondaryAction = "";
        this.primaryAction = "";
		this.promiseReject = null;
		this.promiseResolve = null;
    }

    openConfirmDialog(heading: string, message: string, secondaryAction: string = 'Cancel', primaryAction: string = 'Delete'): Promise<ConfirmDialogResult> {
        if(this.isConfirmPending()){
            throw(new Error(`There is already an active confirmation: ${ this.message }`));
        }
        var promise = new Promise<ConfirmDialogResult>((resolve, reject) => {
            this.heading = heading;
            this.message = message;
            this.secondaryAction = secondaryAction;
            this.primaryAction = primaryAction;
			this.promiseResolve = resolve;
			this.promiseReject = reject;
        });
        return(promise);
    }
    openFlagConfirmDialog(heading: string, message: string, secondaryAction: string = 'Cancel', primaryAction: string = 'Flag'): Promise<ConfirmDialogResult> {
      if(this.isConfirmPending()){
          throw(new Error(`There is already an active confirmation: ${ this.message }`));
      }
      var promise = new Promise<ConfirmDialogResult>((resolve, reject) => {
          this.heading = heading;
          this.message = message;
          this.secondaryAction = secondaryAction;
          this.primaryAction = primaryAction;
    this.promiseResolve = resolve;
    this.promiseReject = reject;
      });
      return(promise);
  }

    isConfirmPending(): boolean {
        return(!!this.promiseResolve);
    }

    resolveConfirm(value: ConfirmDialogResult): void {
        if(!this.isConfirmPending()) {
            throw( new Error("There is no active confirmation"));
        }
        this.promiseResolve(value);
        this.heading = "";
        this.message = "";
        this.secondaryAction = "";
        this.primaryAction = "";
		this.promiseResolve = null;
		this.promiseReject = null;
    }

    resolveConfirmWithDefault() : void {
        this.resolveConfirm(false);
    }

}
