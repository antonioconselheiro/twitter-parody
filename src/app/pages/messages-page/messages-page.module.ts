import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesPageComponent } from './messages-page.component';

@NgModule({
  declarations: [
    MessagesPageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MessagesPageComponent
  ]
})
export class MessagesPageModule { }
