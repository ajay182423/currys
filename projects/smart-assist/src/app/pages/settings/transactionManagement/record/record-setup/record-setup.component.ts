import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalPopupService } from 'common_modules/services/modal-popup.service';


@Component({
  selector: 'app-record-setup',
  templateUrl: './record-setup.component.html',
  styleUrls: [ './record-setup.component.scss']
})
export class RecordSetupComponent implements OnInit {

  @Input() modalPopupObj: any;
  isLoading: boolean = false;
  modalForm: FormGroup;

  constructor(
    private modalPopupService: ModalPopupService,
  ) { }

  tableHeaders: any = [
    {id: 1, name: "Id", order: 'asc', type: '',  class: 'th-sort-asc'},
    {id: 2, name: "Group", order: 'desc', type: '',  class: 'th-sort'},
    {id: 3, name: "Users", order: 'desc', type: '',  class: 'th-sort'},
    {id: 4, name: "Is Active", order: 'desc', type: '',  class: 'th-sort'},
    {id: 5, name: "Updated By", order: 'desc', type: '',  class: 'th-sort'},
    {id: 6, name: "Updated On", order: 'desc', type: 'date',  class: 'th-sort'}
  ];

  ngOnInit(): void {
    this.isLoading = true;
  }

  questions: any[] = [
    {"data": "Was the Compensation successfully issued to customer?"},
    {"data": "Was compensation successfully processed through BACS Transfer?"},
    {"data": "Was compensation successfully processed through cheque?"},
    {"data" : "Was the Refund successfully issued to customer?"},
    {"data": "Was refund successfully processed through BACS Transfer?"},
    {"data": "Was refund successfully processed through cheque?"}
  ]
  productQuestion : any[] = [
    {
      "data" : "Was the reason for decline of refund communicated to the originator after all necessary validation "
    },
    {
      "data" : "Was all details required for refund was mentioned by the requestor if NOT has the requestor been informed "
    },
    {
      "data": "Was the invoice actioned correctly?"
    },
    {
      "data": "Was the correct amount refunded if the invoice is paid?"
    },
    {
      "data": "Was the invoice sent within SLA (Public Lighting)?"
    }
  ]

  receiveCreateNewRequest() {
    this.openSetupPopup(0, true);
  }

  openSetupPopup(recordId: any, isNewEntry: boolean){
    this.modalPopupService.openModalPopup({
      openPopup: true,
      recordId: recordId,
      isNewEntry: isNewEntry,
      popupPosition: 'right',
      heading: 'Add New Questions',
      width:'55rem',
    });
  }

}
