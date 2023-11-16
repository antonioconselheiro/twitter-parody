export interface IUnauthenticatedUser {
  npub: string;
  nsecEncrypted: string;
  displayName: string;
  picture: string;
  nip05?: string;
  nip05valid?: boolean;
}
