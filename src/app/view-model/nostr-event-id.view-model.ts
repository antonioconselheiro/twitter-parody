import { HexString } from "@belomonte/nostr-ngx";

/**
 * You may not have all the data for an event, but having its id is enough to associate
 * the object with what is related to it until the data that represents it is found.
 */
export interface NostrEventIdViewModel {

  /**
   * hexadecimal event id
   */
  readonly id: HexString;

  /**
   * It is assumed that all events have the creation date property. If this property information is not loaded,
   * then this attribute must be filled with -Infinity, which will trigger this event to be ordered last.
   * If I used null to represent the absence of a value, the interfaces that extend this would all need to
   * support null. If the event was loaded, it will necessarily have this property filled. Therefore, to avoid
   * using null and not being able to use 0 or -1, as they are valid timestamp values, I adopted the lowest
   * possible value in terms of time, -Infinity.
   */
  createdAt: number;
}
