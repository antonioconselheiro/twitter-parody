import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileWidgetModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
