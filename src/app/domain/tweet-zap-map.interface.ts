import { TEventId } from "./event-id.type"
import { IZap } from "./zap.interface"

export type ITweetZapMap = {
  [idEvent: TEventId]: IZap
}
