import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingChatComponent } from './floating-chat.component';
import { FloatingChatMessagesComponent } from './floating-chat-messages/floating-chat-messages.component';
import { FloatingChatContactsComponent } from './floating-chat-contacts/floating-chat-contacts.component';
import { DatetimeWidgetModule } from '@shared/datetime-widget/datetime-widget.module';
import { ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';

@NgModule({
  declarations: [
    FloatingChatComponent,
    FloatingChatContactsComponent,
    FloatingChatMessagesComponent
  ],
  imports: [
    CommonModule,
    DatetimeWidgetModule,
    ProfileWidgetModule
  ],
  exports: [
    FloatingChatComponent
  ]
})
export class FloatingChatModule { }
