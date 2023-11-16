import { IProfile } from "@domain/profile.interface";
import { AuthModalSteps } from "./auth-modal-steps.type";

export interface IAuthModalArguments {
  currentAuthProfile?: IProfile | null;
  currentStep?: AuthModalSteps | null;
}