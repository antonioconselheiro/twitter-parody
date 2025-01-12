import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountRenderable } from '@belomonte/nostr-ngx';
import { DirectMessage } from '../message.interface';

@Component({
  selector: 'tw-floating-chat-contacts',
  templateUrl: './floating-chat-contacts.component.html',
  styleUrls: ['./floating-chat-contacts.component.scss']
})
export class FloatingChatContactsComponent {

  @Output()
  choose = new EventEmitter<AccountRenderable>();

  @Output()
  collapse = new EventEmitter<boolean>();

  @Input()
  collapsed = true;

  @Input()
  contacteds: DirectMessage[] = [];
}
