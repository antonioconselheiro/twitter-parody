import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NostrMetadata } from '@nostrify/nostrify';

@Component({
  selector: 'tw-floating-chat-messages',
  templateUrl: './floating-chat-messages.component.html',
  styleUrls: ['./floating-chat-messages.component.scss']
})
export class FloatingChatMessagesComponent {

  @Output()
  back = new EventEmitter<void>();

  @Output()
  collapse = new EventEmitter<boolean>();

  @Input()
  collapsed = true;

  @Input()
  contact: NostrMetadata | null = null;
}
