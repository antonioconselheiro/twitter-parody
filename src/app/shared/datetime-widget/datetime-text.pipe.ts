import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'datetimeText'
})
export class DatetimeTextPipe implements PipeTransform {

  private readonly millisecondsInSecond = 1000;

  transform(value: number): string {
    const valueInMilliseconds = (value * this.millisecondsInSecond);
    return moment(valueInMilliseconds).format('hh:mm A · MMM D, YYYY');
  }

}
