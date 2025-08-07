import { UrlMatchResult, UrlSegment } from "@angular/router";
import { NIP05_REGEX } from "nostr-tools/nip05";

export class AppRoutingMatcher {

  private static readonly profileIndex = 0;
  private static readonly staticImgKeywordIndex = 1;
  private static readonly eventIndex = 2;
  private static readonly imageViewingIndex = 3;
  private static readonly imageViewingAmount = 4;

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

  static imageViewingRoutingMatch(consumed: UrlSegment[], prefixProfile: string, prefixEvent: string): UrlMatchResult | null {
    const imageIndex = Number(consumed[AppRoutingMatcher.imageViewingIndex].path);
    if (
      consumed.length === AppRoutingMatcher.imageViewingAmount &&
      new RegExp(`^${prefixProfile}1`).test(consumed[AppRoutingMatcher.profileIndex].path) &&
      consumed[AppRoutingMatcher.staticImgKeywordIndex].path === 'img' &&
      new RegExp(`^${prefixEvent}1`).test(consumed[AppRoutingMatcher.eventIndex].path) &&
      !isNaN(imageIndex)
    ) {
      return {
        consumed,
        posParams: {
          [prefixProfile]: consumed[AppRoutingMatcher.profileIndex],
          [prefixEvent]: consumed[AppRoutingMatcher.eventIndex],
          'img': consumed[AppRoutingMatcher.imageViewingIndex]
        }
      };
    }

    return null;
  }

  static nip05ImageViewingRoutingMatch(consumed: UrlSegment[], prefixEvent: string): UrlMatchResult | null {
    const imageIndex = Number(consumed[AppRoutingMatcher.imageViewingIndex].path);
    if (
      consumed.length === AppRoutingMatcher.imageViewingAmount &&
      NIP05_REGEX.test(consumed[AppRoutingMatcher.profileIndex].path) &&
      consumed[AppRoutingMatcher.staticImgKeywordIndex].path === 'img' &&
      new RegExp(`^${prefixEvent}1`).test(consumed[AppRoutingMatcher.eventIndex].path) &&
      !isNaN(imageIndex)
    ) {
      return {
        consumed,
        posParams: {
          'nip05': consumed[AppRoutingMatcher.profileIndex],
          [prefixEvent]: consumed[AppRoutingMatcher.eventIndex],
          'img': consumed[AppRoutingMatcher.imageViewingIndex]
        }
      };
    }

    return null;
  }
}
