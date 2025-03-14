import { Component, Input } from '@angular/core';
import { AccountRenderable } from '@belomonte/nostr-ngx';
import { DirectMessage } from './message.interface';

@Component({
  selector: 'tw-floating-chat',
  templateUrl: './floating-chat.component.html',
  styleUrls: ['./floating-chat.component.scss']
})
export class FloatingChatComponent {
  //  TODO: persistir essa informação no localstorage ou no armazemanto do app
  collapsed = true;

  talkingContact: AccountRenderable | null = null;

  @Input()
  lastMessageFromEachContactedProfile: DirectMessage[] = [];
}
