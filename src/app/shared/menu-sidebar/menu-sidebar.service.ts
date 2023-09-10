import { Injectable } from '@angular/core';
import { ModalService } from '@shared/modal/modal.service';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { AuthModalComponent } from '@shared/security/auth-modal/auth-modal.component';

@Injectable()
export class MenuSidebarService {

  constructor(
    private modalService: ModalService,
    private profiles$: ProfilesObservable
  ) {}

  onProfileButtonClick(): void {
    const profile = this.profiles$.getAuthProfile();
    if (!profile) {
      this.modalService
        .createModal(AuthModalComponent);
    }
  }
}
