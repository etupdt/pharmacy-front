import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterString'
})
export class FilterStringPipe implements PipeTransform {

  transform(values: any[], ...args: unknown[]): any[] {
    console.log(values)
    return values.filter(value => typeof(value.value) === 'number');
  }

}
