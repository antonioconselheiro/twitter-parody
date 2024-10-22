import { InjectionToken } from "@angular/core";
import { NoteHtmlfier } from "./note-htmlfier.interface";

export const HTML_PARSER_TOKEN = new InjectionToken<NoteHtmlfier>('HtmlParser');