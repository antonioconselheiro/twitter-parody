import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeObservable } from './theme.observable';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ThemeObservable
  ]
})
export class ThemeModule { }
