import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultHtmlfy } from './default.htmlfy';
import { HTML_PARSER_TOKEN } from './html-parser.token';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DefaultHtmlfy,
    {
      provide: HTML_PARSER_TOKEN,
      useClass: DefaultHtmlfy
    }
  ]
})
export class HtmlfyServiceModule { }
