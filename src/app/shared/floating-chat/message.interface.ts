import { IProfile } from "@shared/profile-service/profile.interface";

export interface IMessage {
  text: string;
  time: number;
  author: IProfile;
}
