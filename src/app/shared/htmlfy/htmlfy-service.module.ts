import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultHtmlfyService } from './default-htmlfy.service';
import { HTML_PARSER_TOKEN } from './html-parser.token';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DefaultHtmlfyService,
    {
      provide: HTML_PARSER_TOKEN,
      useClass: DefaultHtmlfyService
    }
  ]
})
export class HtmlfyServiceModule { }
