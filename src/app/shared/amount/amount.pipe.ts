import { Pipe, PipeTransform } from '@angular/core';
import { Calc } from 'calc-js';

@Pipe({
  name: 'amount'
})
export class AmountPipe implements PipeTransform {

  transform(value: number): string {
    const minimalToFormat = 1_000;
    const secondFormatStyle = 10_000;
    const thirdFormatStyle = 1_000_000

    if (value < minimalToFormat) {
      return String(value);
    } else if (value < secondFormatStyle) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else if (value < thirdFormatStyle) {
      const commaBase = 10;
      const mil = new Calc(value)
        .divide(secondFormatStyle)
        .multiply(commaBase)
        .pipe(n => Math.floor(n))
        .divide(commaBase)
        .finish();

        const milFormatted = String(mil).replace(/\./, ',');
        return `${milFormatted} mil`;
    } else {
      const commaBase = 10;
      let mi = new Calc(value)
        .divide(thirdFormatStyle)
        .multiply(commaBase)
        .pipe(n => Math.floor(n))
        .divide(commaBase)
        .finish();

        const miFormatted = String(mi).replace(/\./, ',');
        return `${miFormatted} mi`;
    }


  }

}
