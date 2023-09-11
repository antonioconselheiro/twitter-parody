import { Component } from '@angular/core';
import { IProfile } from '@shared/profile-service/profile.interface';

@Component({
  selector: 'tw-floating-chat',
  templateUrl: './floating-chat.component.html',
  styleUrls: ['./floating-chat.component.scss']
})
export class FloatingChatComponent {
  //  TODO: persistir essa informação no localstorage ou no armazemanto do app
  collapsed = true;

  talkingContact: IProfile | null = null;
}
