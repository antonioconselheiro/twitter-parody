import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultHtmlfier } from './default.htmlfier';
import { HTML_PARSER_TOKEN } from './html-parser.token';

/**
 * this is a service module, exclusive for service providing.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DefaultHtmlfier,
    {
      provide: HTML_PARSER_TOKEN,
      useClass: DefaultHtmlfier
    }
  ]
})
export class NoteHtmlfierModule { }
