import { Component } from "@angular/core";
import { NavigationStart, Router } from "@angular/Router";
import { ConfirmDialogResult, ConfirmDialogService } from "common_modules/services/confirm-dialog.service";
import { InputDialogResult, InputDialogService } from "common_modules/services/input-dialog.service";

@Component({
	selector: "dialog-container",
	templateUrl: './dialog-container.component.html',
	styles: [
        `:host {
            display: block ;
            position: relative;
            z-index:299; 
        }`
    ],
})
export class DialogContainerComponent {

	constructor(
		public confirmDialogService: ConfirmDialogService,
		public inputDialogService: InputDialogService,
		private router: Router,
	) { }

	handleConfirmDialogResult(value: ConfirmDialogResult) : void {
		this.confirmDialogService.resolveConfirm(value);
	}

	handleInputDialogResult(value: InputDialogResult) : void {
		this.inputDialogService.resolveInput(value);
	}

	ngOnInit() : void {
		this.router.events.subscribe((event) => {
			if(event instanceof NavigationStart){
				this.handleRouterNavigation();
			}
		});
	}

	handleRouterNavigation() : void {
		if(this.confirmDialogService.isConfirmPending() ) {
			this.confirmDialogService.resolveConfirmWithDefault();
		} else if ( this.inputDialogService.isInputPending() ) {
			this.inputDialogService.resolveInputWithDefault();
		} 
	}

}