import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingChatComponent } from './floating-chat.component';
import { FloatingChatMessagesComponent } from './floating-chat-messages/floating-chat-messages.component';
import { FloatingChatContactsComponent } from './floating-chat-contacts/floating-chat-contacts.component';
import { ProfileWidgetModule } from '@shared/profile-widget/profile-widget.module';
import { DatetimeWidgetModule } from '@shared/datetime-widget/datetime-widget.module';

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
