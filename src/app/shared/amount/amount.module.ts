import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountPipe } from './amount.pipe';

@NgModule({
  declarations: [
    AmountPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AmountPipe
  ]
})
export class AmountModule { }
