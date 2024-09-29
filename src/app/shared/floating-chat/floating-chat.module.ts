import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';
import { DatetimeWidgetModule } from '@shared/datetime-widget/datetime-widget.module';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';
import { FloatingChatContactsComponent } from './floating-chat-contacts/floating-chat-contacts.component';
import { FloatingChatMessagesComponent } from './floating-chat-messages/floating-chat-messages.component';
import { FloatingChatComponent } from './floating-chat.component';

@NgModule({
  declarations: [
    FloatingChatComponent,
    FloatingChatContactsComponent,
    FloatingChatMessagesComponent
  ],
  imports: [
    CommonModule,
    DatetimeWidgetModule,
    ProfileWidgetModule,
    SvgLoaderModule
  ],
  exports: [
    FloatingChatComponent
  ]
})
export class FloatingChatModule { }
