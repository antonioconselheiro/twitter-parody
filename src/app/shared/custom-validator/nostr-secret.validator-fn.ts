import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { nip19 } from "nostr-tools";

export function nostrSecretValidatorFactory(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    //  I'm not the 'required' validator
    if (!control.value) {
      return null;
    }

    try {
      const { type } = nip19.decode(control.value);

      if (type === 'npub') {
        return {
          invalidNostrPublicGivenInstead: true
        }
      } else if (type === 'nsec') {
        return null;
      }

      return {
        invalidNostrSecret: true
      };
    } catch {
      return {
        invalidNostrSecret: true
      };
    }

  };
}
