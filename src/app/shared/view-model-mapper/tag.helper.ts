import { Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrGuard, TagPointerRelated } from '@belomonte/nostr-ngx';
import { EventRelationType } from '@view-model/event-relation.type';
import { nip19 } from "nostr-tools";

@Injectable({
  providedIn: 'root'
})
export class TagHelper {

  constructor(
    private guard: NostrGuard
  ) { }

  /**
   * find tag for type
   * @returns list of tags
   */
  listTagsByType<T extends string>(type: T, event: NostrEvent): Array<[T, ...string[]]> {
    return event.tags
      .filter((event): event is [T, ...string[]] => event[0] === type);
  }

  /**
   * find all tags of a type filled with a hexadecimal id in the first value
   * @returns list of ids
   */
  listIdsFromTag(type: string, event: NostrEvent): Array<HexString> {
    return event.tags
      .filter((tag): tag is [typeof type, HexString] => tag[0] === type && this.guard.isHexadecimal(tag[1]))
      .map(([, idEvent]) => idEvent);
  }

  /**
   * find tag for type
   * @returns first tag matching to the type
   */
  getTagByType<T extends string>(type: T, event: NostrEvent): [T, ...string[]] | null {
    return event.tags
      .find((event): event is [T, ...string[]] => event[0] === type) || null;
  }

  /**
   * get the first value of the first tag of the given type
   * @returns first value of the first find tag
   */
  getTagValueByType(type: string, event: NostrEvent): string | null {
    const tag = this.getTagByType(type, event);
    if (tag && tag[1]) {
      return tag[1];
    }

    return null;
  }

  getRelatedEvents(event: NostrEvent): [
    string, EventRelationType
  ][] {
    const idIndex = 1;
    const typeIndex = 3;

    return event.tags
      .filter(([type]) => type === 'e')
      .map(event => {
        const idEvent = event[idIndex];
        const relationType = (event[typeIndex] || '') as EventRelationType;

        return [idEvent, relationType];
      });
  }

  getFirstRelatedEvent(event: NostrEvent): string | null {
    const matrix = this.getRelatedEvents(event);
    return matrix.at(0)?.at(0) || null;
  }

  getMentionedEvent(event: NostrEvent): string | null {
    const mentionedFound = this
      .getRelatedEvents(event)
      .filter(([, type]) => type === 'mention')
      .map(([idEvent]) => idEvent)
      .at(0) || null;

    if (!mentionedFound) {
      return this.getNoteMentionedInContent(event);
    }

    return mentionedFound;
  }

  getNoteMentionedInContent(event: NostrEvent): string | null {
    const matches = event.content.match(/nostr:note[\da-z]+/);
    const match = matches && matches[0] || null;
    if (match) {
      const { data } = nip19.decode(match.replace(/^nostr:/, ''));
      return data ? String(data) : null;
    }

    return null;
  }

  getRepliedEvent(event: NostrEvent): {
    replied: string | null,
    root: string | null
  } {
    const replyData: {
      replied: string | null,
      root: string | null
    } = {
      replied: null,
      root: null
    };

    this
      .getRelatedEvents(event)
      .forEach(([idEvent, relation]) => {
        if (relation === 'reply') {
          replyData.replied = idEvent;
        } else if (relation === 'root') {
          replyData.root = idEvent;
        }
      });

    return replyData;
  }

  getPubkeyTags(event: NostrEvent): Array<TagPointerRelated<'p'>> {
    return event.tags
      .filter((tag): tag is TagPointerRelated<'p'> => tag[0] === 'p');
  }

  getPubkeys(event: NostrEvent): HexString[] {
    return event.tags
      .filter(([type]) => type === 'p')
      .map(([, pubkey]) => pubkey);
  }

  getFirstProfile(event: NostrEvent): string | null {
    return this.getPubkeys(event).at(0) || null;
  }
}