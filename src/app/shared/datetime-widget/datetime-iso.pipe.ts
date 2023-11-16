import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetimeIso'
})
export class DatetimeIsoPipe implements PipeTransform {

  transform(timestamp: number): string {
    const milliseconds = 1000;
    return new Date(timestamp * milliseconds).toISOString();
  }

}
