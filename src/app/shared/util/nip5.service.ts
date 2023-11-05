import { Nip5Response } from "./nip5-response.interface";

export class Nip5Util {
  static async getNpubByNip5Addr(nip5Addr: string): Promise<string | null> {
    const [nip5Name, nip5Url] = nip5Addr.split('@');

    if (!nip5Name || !nip5Url) {
      return null;
    }

    const result = await fetch(`https://${nip5Url}/.well-known/nostr.json?name=${nip5Name}`);

    const body: Nip5Response = await result.json();

    return body.names[nip5Name];
  }
}
