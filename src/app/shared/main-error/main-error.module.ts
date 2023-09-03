import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainErrorObservable } from './main-error.observable';
import { NetworkErrorObservable } from './network-error.observable';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    MainErrorObservable,
    NetworkErrorObservable
  ]
})
export class MainErrorModule { }
