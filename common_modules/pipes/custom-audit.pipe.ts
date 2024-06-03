// filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customAudit' })
export class FilterCustomAuditPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], filterText:string, sectionName:string): any[] {
    if (!items) {
      return [];
    }
    if (!filterText) {
      return items;
    }
    // searchText = searchText.toLocaleLowerCase();
 
      return items.filter(it => {
        return it.auditResult == 'Yes';
      });
    
  }
}