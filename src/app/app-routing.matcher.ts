import { UrlMatchResult, UrlSegment } from "@angular/router";
import { nip19 } from "nostr-tools";
import { NIP05_REGEX } from "nostr-tools/nip05";

export class AppRoutingMatcher {

  static routingMatchNote(consumed: UrlSegment[]): UrlMatchResult | null {
    if (!consumed.length) {
      return null;
    }

    if (consumed.length === 1 && /^note1/.test(consumed[0].path)) {
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

  static routingMatchNoteImage(consumed: UrlSegment[]): UrlMatchResult | null {
    if (!consumed.length) {
      return null;
    }

    const staticImgKeywordIndex = 1;
    const imageViewingIndex = 2;

    if (
      !consumed[staticImgKeywordIndex] ||
      !consumed[imageViewingIndex]
    ) {
      return null;
    }

    const imageIndex = Number(consumed[imageViewingIndex].path);
    if (
      /^note1/.test(consumed[0].path) &&
      consumed[staticImgKeywordIndex].path === 'img' &&
      !isNaN(imageIndex)
    ) {
      const { data } = nip19.decode(consumed[0].path);
      if (typeof data === 'string') {
        const eventSegment = new UrlSegment(data, {});
        const imageIndexSegment = new UrlSegment(String(imageIndex), {});
        const posParams: {
          [name: string]: UrlSegment;
        } = {
          'event': eventSegment,
          'img': imageIndexSegment
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

    if (consumed.length === 1 && /^nevent1/.test(consumed[0].path)) {
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

  // eslint-disable-next-line complexity
  static routingMatchNeventImage(consumed: UrlSegment[]): UrlMatchResult | null {
    if (!consumed.length) {
      return null;
    }
    const staticImgKeywordIndex = 1;
    const imageViewingIndex = 2;

    if (/^nevent1/.test(consumed[0].path)) {
      const { data } = nip19.decode(consumed[0].path);

      const imageIndex = Number(consumed[imageViewingIndex].path);
      if (
        data instanceof Object &&
        'relays' in data &&
        'id' in data &&
        'author' in data &&
        consumed[staticImgKeywordIndex].path === 'img' &&
        !isNaN(imageIndex)
      ) {
        const eventSegment = new UrlSegment(data.id, {});
        const imageIndexSegment = new UrlSegment(String(imageIndex), {});

        const posParams: {
          [name: string]: UrlSegment;
        } = {
          'event': eventSegment,
          'img': imageIndexSegment
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

        AppRoutingMatcher.routingImageMatch(consumed, posParams);

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

        AppRoutingMatcher.routingImageMatch(consumed, posParams);

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
      AppRoutingMatcher.routingImageMatch(consumed, posParams);

      return {
        consumed,
        posParams
      };
    }

    return null;
  }

  static routingImageMatch(consumed: UrlSegment[], posParams: {
    [name: string]: UrlSegment;
  }): void {
    const noteIndex = 1,
      staticImgKeywordIndex = 2,
      imageViewingIndex = 3;

    if (consumed[noteIndex] && /^note1/.test(consumed[noteIndex].path)) {
      const { data } = nip19.decode(consumed[noteIndex].path);
      if (typeof data === 'string') {
        posParams['event'] = new UrlSegment(data, {});
      }

      if (
        consumed[staticImgKeywordIndex] &&
        consumed[imageViewingIndex] &&
        consumed[staticImgKeywordIndex].path === 'img' &&
        /^\d+$/.test(consumed[imageViewingIndex].path)
      ) {
        posParams['img'] = new UrlSegment(consumed[imageViewingIndex].path, {});
      }
    }
  }
}
