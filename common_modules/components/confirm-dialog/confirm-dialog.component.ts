import { Component, ElementRef, EventEmitter, ViewChild } from "@angular/core";

@Component({
	selector: "confirm-dialog",
	inputs: ["heading", "message", "secondaryAction", "primaryAction"],
	outputs: ["valueEvents: value"],
	queries: {
		primaryButton: new ViewChild("primaryButton")
	},
	templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
})

export class ConfirmDialogComponent {

    public heading!: string;
	public message!: string;
    public secondaryAction!: string;
    public primaryAction!: string;
	public primaryButton!: ElementRef;
    
    private valueEvents: EventEmitter<boolean>;

    constructor() {
        this.valueEvents = new EventEmitter();
    }
    
    ngAfterViewInit(): void {
        //this.primaryButton.nativeElement.focus();
    }

	processConfirm(value: boolean): void {
        this.valueEvents.emit(value);
    }

}