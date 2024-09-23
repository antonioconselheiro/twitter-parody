import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';
import { ProfilePageComponent } from './profile-page.component';

@NgModule({
  declarations: [
    ProfilePageComponent
  ],
  imports: [
    CommonModule,
    ProfileWidgetModule
  ],
  exports: [
    ProfilePageComponent
  ]
})
export class ProfilePageModule { }
