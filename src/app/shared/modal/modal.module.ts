import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalService } from './modal.service';
import { CustomModalComponent } from './custom-modal/custom-modal.component';

@NgModule({
  declarations: [
    AlertComponent,
    ModalConfirmComponent,
    CustomModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    ModalConfirmComponent,
    CustomModalComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule { }
