import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimeIsoPipe } from './datetime-iso.pipe';
import { DatetimeTextPipe } from './datetime-text.pipe';

@NgModule({
  declarations: [
    DatetimeIsoPipe,
    DatetimeTextPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DatetimeIsoPipe,
    DatetimeTextPipe
  ]
})
export class DatetimeWidgetModule { }
