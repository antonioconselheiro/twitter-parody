import { IProfile } from "@belomonte/nostr-credential-ngx";

export interface IMessage {
  text: string;
  time: number;
  author: IProfile;
}
