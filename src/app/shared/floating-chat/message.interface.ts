import { IProfile } from "@domain/profile.interface";

export interface IMessage {
  text: string;
  time: number;
  author: IProfile;
}
