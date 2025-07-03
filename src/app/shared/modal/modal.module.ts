import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalService } from './modal.service';
import { MainModalComponent } from './main-modal/main-modal.component';
import { AsyncModalModule } from '@belomonte/async-modal-ngx';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';
import { SubscribeToContinueComponent } from './subscribe-to-continue/subscribe-to-continue.component';

@NgModule({
  imports: [
    CommonModule,
    SvgLoaderModule,
    AsyncModalModule
  ],
  declarations: [
    AlertComponent,
    ModalConfirmComponent,
    MainModalComponent,
    SubscribeToContinueComponent
  ],
  exports: [
    AlertComponent,
    ModalConfirmComponent,
    MainModalComponent,
    SubscribeToContinueComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule { }
