import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from '@shared/loading/loading.module';
import { AuthModalComponent } from './auth-modal.component';
import { AddAccountFormComponent } from './add-account-form/add-account-form.component';
import { AuthenticateFormComponent } from './authenticate-form/authenticate-form.component';
import { SelectAccountListComponent } from './select-account-list/select-account-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileWidgetModule } from '@shared/profile-widget/profile-widget.module';

@NgModule({
  declarations: [
    AuthModalComponent,
    AddAccountFormComponent,
    AuthenticateFormComponent,
    SelectAccountListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileWidgetModule,
    LoadingModule
  ],
  exports: [
    AuthModalComponent
  ]
})
export class AuthModalModule { }
