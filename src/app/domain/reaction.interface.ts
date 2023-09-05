import { IProfile } from "@shared/profile-service/profile.interface";

export interface IReaction {
  content: string;
  author: IProfile;
}
