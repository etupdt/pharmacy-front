import { NgIterable, Pipe, PipeTransform } from '@angular/core';
import { OnSiteService } from '../entities/on-site-service';

@Pipe({
  name: 'isUpdated'
})
export class IsUpdatedPipe implements PipeTransform {

  transform(value: OnSiteService[], ...args: unknown[]): OnSiteService[] {

    return value.sort((a, b) => a.getOnSiteServiceName < b.getOnSiteServiceName ? -1 : 1)

  }

}
