import { NostrUser } from "@domain/nostr-user";

export interface IProfile {
  npub: string;
  user: NostrUser;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  display_name?: string;
  picture?: string;
  about?: string;
  banner?: string;
  lud16?: string;
  website?: string;
  nip05?: string;
  //  format: 1684022601
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at?: number;
  nip05valid?: boolean;
  theme?: 'dark' | 'darken' | 'light';
  color?: 'blue' | 'yellow' | 'magenta' | 'purple' | 'orange' | 'green';
  lang?: 'en' | 'pt-BR',
  fixed?: string; // eventid
  location?: string;
}
