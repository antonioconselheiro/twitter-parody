import { AccountAuthenticable, AccountComplete } from '@belomonte/nostr-ngx';

export interface DirectMessage {
  text: string;
  time: number;
  author: AccountComplete | AccountAuthenticable;
}
