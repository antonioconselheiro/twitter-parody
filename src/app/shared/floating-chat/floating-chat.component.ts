import { Component, Input } from '@angular/core';
import { IMessage } from './message.interface';
import { NostrMetadata } from '@nostrify/nostrify';

@Component({
  selector: 'tw-floating-chat',
  templateUrl: './floating-chat.component.html',
  styleUrls: ['./floating-chat.component.scss']
})
export class FloatingChatComponent {
  //  TODO: persistir essa informação no localstorage ou no armazemanto do app
  collapsed = true;

  talkingContact: NostrMetadata | null = null;

  @Input()
  lastMessageFromEachContactedProfile: IMessage[] = [];
}
