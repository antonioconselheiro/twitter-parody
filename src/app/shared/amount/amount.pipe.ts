import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount'
})
export class AmountPipe implements PipeTransform {

  transform(value: number): string {
    const minimalToFormat = 1_000;
    const secondFormatStyle = 10_000;
    const thirdFormatStyle = 1_000_000
    if (!value) {
      return '';
    } else if (value < minimalToFormat) {
      return String(value);
    } else if (value < secondFormatStyle) {
      const valueStr = String(value)
      return `${valueStr.substring(0, 1)}.${valueStr.substring(1)}`;
    } else if (value < thirdFormatStyle) {
      const commaBase = 10;
      const reduceSize = 1_000;
      const mil = Math.floor((value / reduceSize) * commaBase) / commaBase;

      const milFormatted = String(mil).replace(/\./, ',');
      return `${milFormatted} mil`;
    } else {
      const commaBase = 10;
      const mi = Math.floor((value / thirdFormatStyle) * commaBase) / commaBase;

      const miFormatted = String(mi).replace(/\./, ',');
      return `${miFormatted} mi`;
    }
  }
}
