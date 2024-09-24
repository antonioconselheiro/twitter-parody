/* eslint-disable max-lines */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DirectMessage } from '../message.interface';
import { NostrMetadata } from '@nostrify/nostrify';
import { Account } from '@belomonte/nostr-ngx';

@Component({
  selector: 'tw-floating-chat-contacts',
  templateUrl: './floating-chat-contacts.component.html',
  styleUrls: ['./floating-chat-contacts.component.scss']
})
export class FloatingChatContactsComponent {

  @Output()
  choose = new EventEmitter<Account>();

  @Output()
  collapse = new EventEmitter<boolean>();

  @Input()
  collapsed = true;

  @Input()
  contacteds: DirectMessage[] = [];
}
