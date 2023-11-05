import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlUtil } from './url.service';
import { Nip5Util } from './nip5.util';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UrlUtil,
    Nip5Util
  ]
})
export class UtilModule { }
