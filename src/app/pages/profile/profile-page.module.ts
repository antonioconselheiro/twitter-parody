import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileWidgetModule, SvgRenderModule } from '@belomonte/nostr-gui-ngx';
import { ProfilePageComponent } from './profile-page.component';

@NgModule({
  declarations: [
    ProfilePageComponent
  ],
  imports: [
    CommonModule,
    SvgRenderModule,
    ProfileWidgetModule
  ],
  exports: [
    ProfilePageComponent
  ]
})
export class ProfilePageModule { }
