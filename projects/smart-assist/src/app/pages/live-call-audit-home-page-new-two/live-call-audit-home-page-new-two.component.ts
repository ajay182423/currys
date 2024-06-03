import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/Router';
import { AuditRecordsService } from 'projects/smart-assist/src/app/services/pages/audit-records.service';
import { Pipe, PipeTransform } from "@angular/core";

@Component({
  selector: 'app-live-call-audit-home-page-new-two',
  templateUrl: './live-call-audit-home-page-new-two.component.html',
  styleUrls: ['./live-call-audit-home-page-new-two.component.scss']
})

export class LiveCallAuditHomePageNewTwoComponent implements OnInit {

  constructor(private router: Router,  private route: ActivatedRoute, private AuditRecordsService: AuditRecordsService,) { }

  transactionId: string = '';
  user:any;
  userName:any;
  transactionId1:any;
  id : number;
  IdFromRoute: number;
  agentName:any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.transactionId = params['transactionId'];
      this.IdFromRoute = params['ID'];
  })

  this.agentDetails();
}

 // Getting all Agent Details
 agentDetails() {
  this.AuditRecordsService.getRecord(this.transactionId).subscribe((da) => {
    this.agentName = da.agentName;
  });
}



  navigate2(){
    
     this.router.navigate(['live-call-audit-new'],{ queryParams: { transactionId: this.transactionId, ID: this.IdFromRoute }});
  }

  getShortName(fullName) {
    if(fullName != null)
      {
        return fullName.split(' ').map(n => n[0]).join('');
      }    
  }
}

