import { NostrMetadata } from '@nostrify/nostrify';

export interface IMessage {
  text: string;
  time: number;
  author: NostrMetadata;
}
