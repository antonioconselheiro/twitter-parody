import { nostrSecretValidatorFactory } from "./nostr-secret.validator-fn";

export const CustomValidator = {
  nostrSecret: nostrSecretValidatorFactory()
}
