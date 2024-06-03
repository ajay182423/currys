import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/Router';

@Component({
  selector: 'app-live-call-audit-home-page-new',
  templateUrl: './live-call-audit-home-page-new.component.html',
  styleUrls: ['./live-call-audit-home-page-new.component.scss']
})
export class LiveCallAuditHomePageNewComponent implements OnInit {

  transactionId: string = '';
  user:any;
  userName:any;
  transactionId1:any;
  id : number;
  IdFromRoute: number;
  constructor(private router: Router,  private route: ActivatedRoute) { }

  ngOnInit(): void {    
    var user1 = localStorage.getItem('SMAT_user');
    this.user = JSON.parse(user1);
    this.route.queryParams.subscribe((params) => {
      this.transactionId = params['transactionId'];
      this.IdFromRoute = params['ID'];
  })
  }

  navigate(){
    this.router.navigate(['/live-call-audit-home-page-new-two'], { queryParams: { transactionId: this.transactionId, ID: this.IdFromRoute }});
  }
}


