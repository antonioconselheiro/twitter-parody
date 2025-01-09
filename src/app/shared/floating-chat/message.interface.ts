import { AccountAuthenticable, AccountComplete, AccountViewable } from '@belomonte/nostr-ngx';

export interface DirectMessage {
  text: string;
  time: number;
  author: AccountViewable | AccountComplete | AccountAuthenticable;
}
