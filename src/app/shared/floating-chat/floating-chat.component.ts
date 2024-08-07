import { Component, Input } from '@angular/core';
import { IMessage } from './message.interface';
import { IProfile } from '@belomonte/nostr-credential-ngx';

@Component({
  selector: 'tw-floating-chat',
  templateUrl: './floating-chat.component.html',
  styleUrls: ['./floating-chat.component.scss']
})
export class FloatingChatComponent {
  //  TODO: persistir essa informação no localstorage ou no armazemanto do app
  collapsed = true;

  talkingContact: IProfile | null = null;

  @Input()
  lastMessageFromEachContactedProfile: IMessage[] = [];
}
