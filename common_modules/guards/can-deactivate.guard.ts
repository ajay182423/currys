import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/Router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {

  constructor() { }

  canDeactivate(component: any): Observable<boolean> | boolean {
    if (component.modalForm.dirty) {
      return confirm("Are you sure you want to leave without saving");
    } else {
      return true;
    }
  }

}