import { Account } from '@belomonte/nostr-ngx';

export interface DirectMessage {
  text: string;
  time: number;
  author: Account;
}
