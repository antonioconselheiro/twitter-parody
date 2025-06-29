import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'datetimeSmall'
})
export class DatetimeSmallPipe implements PipeTransform {

  private readonly millisecondsInSecond = 1000;
  private readonly secoundsInMinute = 60;
  private readonly minutessInHour = 60;
  private readonly hoursInDay = 24;

  private readonly secondsFormat = this.secoundsInMinute * this.millisecondsInSecond;
  private readonly minutesFormat = this.secondsFormat * this.minutessInHour;
  private readonly hoursFormat = this.minutesFormat * this.hoursInDay;

  transform(value: number): string {
    const valueInMilliseconds = (value * this.millisecondsInSecond)
    const currentTime = new Date();
    const difference = currentTime.getTime() - valueInMilliseconds;

    if (difference < this.hoursFormat) {
      return this.fewHoursAgo(valueInMilliseconds);
    } else {
      const valueDate = new Date(valueInMilliseconds);
      if (valueDate.getFullYear() === currentTime.getFullYear()) {
        return this.daysAgo(valueInMilliseconds);
      } else {
        return this.yearsAgo(valueInMilliseconds);
      }
    }
  }

  private fewHoursAgo(timestamp: number): string {
    return moment(timestamp).fromNow();
  }

  private daysAgo(timestamp: number): string {
    return moment(timestamp).format('MMM D');
  }

  private yearsAgo(timestamp: number): string {
    return moment(timestamp).format('ll');
  }
}
