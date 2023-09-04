import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlUtil {

  regexFromLinks(links: string[]): RegExp {
    const linksAsRegexp = links.map(link => link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    return new RegExp(`^(${linksAsRegexp})`);
  }

  regexFromLink(link: string): RegExp {
    return new RegExp(link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  }
}
