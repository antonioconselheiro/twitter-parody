import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from '@shared/loading/loading.module';
import { AuthModalComponent } from './auth-modal.component';
import { AddAccountFormComponent } from './add-account-form/add-account-form.component';
import { AutenticateFormComponent } from './authenticate-form/authenticate-form.component';
import { SelectAccountListComponent } from './select-account-list/select-account-list.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthModalComponent,
    AddAccountFormComponent,
    AutenticateFormComponent,
    SelectAccountListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingModule
  ],
  exports: [
    AuthModalComponent
  ]
})
export class AuthModalModule { }
