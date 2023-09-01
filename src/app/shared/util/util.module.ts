import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlUtil } from './url.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UrlUtil
  ]
})
export class UtilModule { }
