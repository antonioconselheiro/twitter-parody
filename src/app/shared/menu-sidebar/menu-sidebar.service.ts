import { Injectable } from '@angular/core';
import { CurrentProfileObservable } from '@belomonte/nostr-ngx';
import { AuthModalComponent } from '@shared/auth-modal/auth-modal.component';
import { ModalService } from '@shared/modal/modal.service';

@Injectable()
export class MenuSidebarService {

  constructor(
    private modalService: ModalService,
    private profiles$: CurrentProfileObservable
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
