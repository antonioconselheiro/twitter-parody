import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera.component';
import { CameraObservable } from './camera.observable';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';

@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    CommonModule,
    SvgLoaderModule
  ],
  exports: [
    CameraComponent
  ],
  providers: [
    CameraObservable
  ]
})
export class CameraModule { }
