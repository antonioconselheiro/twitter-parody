import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalService } from './modal.service';

@NgModule({
  declarations: [
    AlertComponent,
    ModalConfirmComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    ModalConfirmComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule { }
