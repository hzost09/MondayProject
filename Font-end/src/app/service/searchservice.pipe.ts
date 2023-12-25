import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class SearchservicePipe implements PipeTransform {

  transform(items: any, searchText: string): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }

    searchText = searchText.toLowerCase();
    return items.filter((it:any) => {
      return  JSON.stringify(it).toLowerCase().includes(searchText);
    });
  }

}
