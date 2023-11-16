import { Injectable } from "@angular/core";

@Injectable()
export class Nip5Util {
  async getNostrPublicByNip5Addr(nip5Addr: string): Promise<string | null> {
    const [nip5Name, nip5Url] = nip5Addr.split('@');

    if (!nip5Name || !nip5Url) {
      return null;
    }

    const result = await fetch(`https://${nip5Url}/.well-known/nostr.json?name=${nip5Name}`);

    const body = await result.json();

    return body.names[nip5Name];
  }
}
