import { IProfile } from "@belomonte/nostr-gui-ngx";

export interface IMessage {
  text: string;
  time: number;
  author: IProfile;
}
