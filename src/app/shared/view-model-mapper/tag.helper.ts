import { Injectable } from '@angular/core';
import { HexString, NostrEvent } from '@belomonte/nostr-ngx';
import { EventRelationType } from '@view-model/event-relation.type';

@Injectable()
export class TagHelper {
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

  getPubkeyTags(event: NostrEvent): Array<[string, HexString, ...string[]]> {
    //  TODO: 
    return event.tags
      .filter(([type]) => type === 'p');
  }

  getPubkeys(event: NostrEvent): HexString[] {
    return event.tags
      .filter(([type]) => type === 'p')
      .map(([, pubkey]) => pubkey);
  }

  getFirstRelatedProfile(event: NostrEvent): string | null {
    return this.getRelatedProfiles(event).at(0) || null;
  }
}