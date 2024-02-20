import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalService } from './modal.service';
import { MainModalComponent } from './main-modal/main-modal.component';
import { AsyncModalModule } from '@belomonte/async-modal-ngx';

@NgModule({
  imports: [
    CommonModule,
    AsyncModalModule
  ],
  declarations: [
    AlertComponent,
    ModalConfirmComponent,
    MainModalComponent
  ],
  exports: [
    AlertComponent,
    ModalConfirmComponent,
    MainModalComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule { }
