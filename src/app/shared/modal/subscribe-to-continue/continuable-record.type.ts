import { ContinuableActionType } from './continuable-action.type';

export type ContinuableRecordType = { [action in ContinuableActionType]: { icon: string, cssClass: string } };