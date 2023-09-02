import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingChatComponent } from './floating-chat.component';

@NgModule({
  declarations: [
    FloatingChatComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FloatingChatComponent
  ]
})
export class FloatingChatModule { }
