import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingChatComponent } from './floating-chat.component';
import { FloatingChatListComponent } from './floating-chat-list/floating-chat-list.component';
import { FloatingChatMessagesComponent } from './floating-chat-messages/floating-chat-messages.component';

@NgModule({
  declarations: [
    FloatingChatComponent,
    FloatingChatListComponent,
    FloatingChatMessagesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FloatingChatComponent
  ]
})
export class FloatingChatModule { }
