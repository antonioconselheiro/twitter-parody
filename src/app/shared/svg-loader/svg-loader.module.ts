import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SVG_RECORD_TOKEN, SvgRenderModule,  } from '@belomonte/nostr-gui-ngx'
import { SvgLoaderService } from './svg-loader.service';

@NgModule({
  imports: [
    CommonModule,
    SvgRenderModule
  ],
  providers: [
    {
      provide: SVG_RECORD_TOKEN,
      useClass: SvgLoaderService
    },
    SvgLoaderService
  ],
  exports: [
    SvgRenderModule
  ]
})
export class SvgLoaderModule { }
