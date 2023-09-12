/* eslint-disable max-lines */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProfile } from '@shared/profile-service/profile.interface';
import { IMessage } from '../message.interface';

@Component({
  selector: 'tw-floating-chat-contacts',
  templateUrl: './floating-chat-contacts.component.html',
  styleUrls: ['./floating-chat-contacts.component.scss']
})
export class FloatingChatContactsComponent {

  @Output()
  choose = new EventEmitter<IProfile>();

  @Output()
  collapse = new EventEmitter<boolean>();

  @Input()
  collapsed = true;

  @Input()
  contacteds: IMessage[] = [];
}
