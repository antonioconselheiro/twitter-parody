import { UrlMatchResult, UrlSegment } from "@angular/router";
import { nip19 } from "nostr-tools";
import { NIP05_REGEX } from "nostr-tools/nip05";

export class AppRoutingMatcher {

  static routingMatchNote(consumed: UrlSegment[]): UrlMatchResult | null {
    if (!consumed.length) {
      return null;
    }

    if (/^note1/.test(consumed[0].path)) {
      const { data } = nip19.decode(consumed[0].path);
      if (typeof data === 'string') {
        const eventSegment = new UrlSegment(data, {});
        const posParams: {
          [name: string]: UrlSegment;
        } = {
          'event': eventSegment
        };

        return {
          consumed,
          posParams
        };
      }
    }

    return null;
  }

  static routingMatchNevent(consumed: UrlSegment[]): UrlMatchResult | null {
    if (!consumed.length) {
      return null;
    }

    if (/^nevent1/.test(consumed[0].path)) {
      const { data } = nip19.decode(consumed[0].path);

      if (data instanceof Object && 'relays' in data && 'id' in data && 'author' in data) {
        const eventSegment = new UrlSegment(data.id, {});
        const posParams: {
          [name: string]: UrlSegment;
        } = {
          'event': eventSegment
        };

        if (data.author) {
          posParams['pubkey'] = new UrlSegment(data.author, {});
        }

        if (data.relays) {
          posParams['relays'] = new UrlSegment(data.relays.join(';'), {});
        }

        return {
          consumed,
          posParams
        };
      }
    }

    return null;
  }

  static routingMatchNprofile(consumed: UrlSegment[]): UrlMatchResult | null {
    if (!consumed.length) {
      return null;
    }
    const profileIndex = 0;

    if (/^nprofile1/.test(consumed[profileIndex].path)) {
      const { data } = nip19.decode(consumed[profileIndex].path);

      if (data instanceof Object && 'relays' in data && 'pubkey' in data) {
        const eventSegment = new UrlSegment(data.pubkey, {});
        const posParams: {
          [name: string]: UrlSegment;
        } = {
          'pubkey': eventSegment
        };

        if (data.relays) {
          posParams['relays'] = new UrlSegment(data.relays.join(';'), {});
        }

        return {
          consumed,
          posParams
        };
      }
    }

    return null;
  }

  static routingMatchNpub(consumed: UrlSegment[]): UrlMatchResult | null {
    if (!consumed.length) {
      return null;
    }
    const profileIndex = 0;

    if (/^npub1/.test(consumed[profileIndex].path)) {
      const { data } = nip19.decode(consumed[profileIndex].path);
      if (typeof data === 'string') {
        const authorSegment = new UrlSegment(data, {});
        const posParams: {
          [name: string]: UrlSegment;
        } = {
          'pubkey': authorSegment
        };

        return {
          consumed,
          posParams
        };
      }
    }

    return null;
  }

  static routingMatchNip05(consumed: UrlSegment[]): UrlMatchResult | null {
    if (!consumed.length) {
      return null;
    }

    const profileIndex = 0;
    const posParams: {
      [name: string]: UrlSegment;
    } = {};

    if (NIP05_REGEX.test(consumed[profileIndex].path)) {
      posParams['nip05'] = consumed[profileIndex];

      return {
        consumed,
        posParams
      };
    }

    return null;
  }

  static routingImageMatch(consumed: UrlSegment[], baseIndex = 1): UrlMatchResult | null {
    const posParams: { [name: string]: UrlSegment; } = { };
    const staticImgKeywordIndex = baseIndex + 1,
      imageViewingIndex = staticImgKeywordIndex + 1;

    if (
      consumed[staticImgKeywordIndex] &&
      consumed[imageViewingIndex] &&
      consumed[staticImgKeywordIndex].path === 'img' &&
      /^\d+$/.test(consumed[imageViewingIndex].path)
    ) {
      posParams['img'] = new UrlSegment(consumed[imageViewingIndex].path, {});

      return {
        consumed,
        posParams
      };
    }

    return null;
  }
}


// /<note>
// /<note>/img/<img>
// 
// /<nevent>
// /<nevent>/img/<img>
// 
// /<nprofile>
// /<npub>
// /<nip05>
// 
// /<nprofile>/<note>
// /<npub>/<note>
// /<nip05>/<note>
// 
// /<nprofile>/<note>/img/<img>
// /<npub>/<note>/img/<img>
// /<nip05>/<note>/img/<img>
