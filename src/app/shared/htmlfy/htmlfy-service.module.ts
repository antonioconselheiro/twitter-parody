import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlfyService } from './htmlfy.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    HtmlfyService
  ]
})
export class HtmlfyServiceModule { }
