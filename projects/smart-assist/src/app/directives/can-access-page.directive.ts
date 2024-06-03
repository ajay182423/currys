import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { IUser } from 'common_modules/interfaces/user';
import { environment } from '../../environments/environment';

@Directive({
  selector: '[canAccessPage]'
})
export class CanAccessPageDirective implements OnInit {
  @Input() canAccessPage: string;
  user: IUser;

  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>) {

    const user: IUser = JSON.parse(localStorage.getItem(environment.localStorageUserItem));
    if (user) {
      this.user = user;
    }
  }

  ngOnInit(): void {
    // clear view if no roles
    if (!this.user?.userRole || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }

    if (this.user.userRole.includes(this.canAccessPage)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
