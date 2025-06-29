import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimeIsoPipe } from './datetime-iso.pipe';
import { DatetimeSmallPipe } from './datetime-small.pipe';
import { DatetimeTextPipe } from './datetime-text.pipe';

@NgModule({
  declarations: [
    DatetimeIsoPipe,
    DatetimeSmallPipe,
    DatetimeTextPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DatetimeIsoPipe,
    DatetimeSmallPipe,
    DatetimeTextPipe
  ]
})
export class DatetimeWidgetModule { }
