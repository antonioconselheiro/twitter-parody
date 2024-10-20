import { InjectionToken } from "@angular/core";
import { DefaultHtmlfyService } from "./default-htmlfy.service";

export const HTML_PARSER_TOKEN = new InjectionToken<DefaultHtmlfyService>('HtmlParser');