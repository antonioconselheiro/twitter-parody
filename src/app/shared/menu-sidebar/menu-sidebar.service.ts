import { Injectable } from '@angular/core';
import { AuthModalComponent } from '@shared/auth-modal/auth-modal.component';
import { ModalService } from '@shared/modal/modal.service';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';

@Injectable()
export class MenuSidebarService {

  constructor(
    private modalService: ModalService,
    private profiles$: AuthenticatedProfileObservable
  ) { }

  onProfileButtonClick(): void {
    const profile = this.profiles$.getAuthProfile();
    if (!profile) {
      this.modalService
        .createModal(AuthModalComponent)
        .build();
    }
  }
}
