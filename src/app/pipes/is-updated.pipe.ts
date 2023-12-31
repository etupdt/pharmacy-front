import { NgIterable, Pipe, PipeTransform } from '@angular/core';
import { OnSiteService } from '../entities/on-site-service';
import { Entity } from '../entities/entity';

@Pipe({
  name: 'isUpdated'
})
export class IsUpdatedPipe implements PipeTransform {

  transform(value: any[], ...args: unknown[]): any[] {

    return value.sort((a, b) => a.getName < b.getName ? -1 : 1)

  }

}
