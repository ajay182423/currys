import { Component, Input } from '@angular/core';

@Component({
  selector: 'page-no-content',
  templateUrl: './page-no-content.component.html',
  styleUrls: ['./page-no-content.component.scss'],
})
export class PageNoContentComponent {

  @Input() options: any;
  @Input() customMinHeight?: string = "calc(100vh - var(--navbar))";

  constructor(){}

}
