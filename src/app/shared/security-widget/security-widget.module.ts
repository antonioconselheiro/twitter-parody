import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProxifyImagePipe } from './proxify-image.pipe';

@NgModule({
  declarations: [
    ProxifyImagePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProxifyImagePipe
  ]
})
export class SecurityWidgetModule { }
