// filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'auditRecords' })
export class FilterAuditRecordsPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any, filterText:string): any[] {
    console.log(items)
    return;
    if (!items) {
      return [];
    }
    if (!filterText) {
      return items;
    }
    // searchText = searchText.toLocaleLowerCase();
 
      return items.filter(it => {
        return it.agentId == filterText;
      });
    
  }
}