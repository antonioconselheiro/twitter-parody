import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera.component';
import { CameraObservable } from './camera.observable';

@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CameraComponent
  ],
  providers: [
    CameraObservable
  ]
})
export class CameraModule { }
