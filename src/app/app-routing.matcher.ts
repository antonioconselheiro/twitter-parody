import { UrlMatchResult, UrlSegment } from "@angular/router";
import { NIP05_REGEX } from "nostr-tools/nip05";

export class AppRoutingMatcher {
  static routingMatch(consumed: UrlSegment[], prefix: string): UrlMatchResult | null {
    if (consumed.length === 1 && new RegExp(`^${prefix}1`).test(consumed[0].path)) {
      return {
        consumed,
        posParams: {
          [prefix]: consumed[0]
        }
      };
    }

    return null;
  }

  static profileEventRoutingMatch(consumed: UrlSegment[], prefixProfile: string, prefixEvent: string): UrlMatchResult | null {
    const paramsAmount = 2;
    if (consumed.length === paramsAmount && new RegExp(`^${prefixProfile}1`).test(consumed[0].path) && new RegExp(`^${prefixEvent}1`).test(consumed[1].path)) {
      return {
        consumed,
        posParams: {
          [prefixProfile]: consumed[0],
          [prefixEvent]: consumed[1]
        }
      };
    }

    return null;
  }

  static nip05RoutingMatch(consumed: UrlSegment[]): UrlMatchResult | null {
    if (consumed.length === 1 && NIP05_REGEX.test(consumed[0].path)) {
      return {
        consumed,
        posParams: {
          'nip05': consumed[0]
        }
      };
    }

    return null;
  }

  static nip05ProfileEventRoutingMatch(consumed: UrlSegment[], prefixEvent: string): UrlMatchResult | null {
    const paramsAmount = 2;
    if (consumed.length === paramsAmount && NIP05_REGEX.test(consumed[0].path) && new RegExp(`^${prefixEvent}1`).test(consumed[1].path)) {
      return {
        consumed,
        posParams: {
          'nip05': consumed[0],
          [prefixEvent]: consumed[1]
        }
      };
    }

    return null;
  }
}
