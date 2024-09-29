import { Injectable } from '@angular/core';
import { SvgRecord } from '@belomonte/nostr-gui-ngx';

@Injectable({
  providedIn: 'root'
})
export class SvgLoaderService extends SvgRecord {

  override async get(svgName: string): Promise<string | null> {
    const svg = await super.get(svgName);
    if (svg) {
      return svg;
    } else {
      return fetch(`/assets/${svgName}.svg`).then(res => res.ok && res.text() || null)
    }
  }
}
