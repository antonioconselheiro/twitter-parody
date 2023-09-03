import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@shared/modal/modal.service';
import { CompositeTweetPopoverComponent } from '@shared/tweet/composite-tweet-popover/composite-tweet-popover.component';

@Component({
  selector: 'tw-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent {

  constructor(
    private modalService: ModalService,
    private router: Router
  ) {}

  openTweetCompose(): void {
    this.modalService
      .createModal(CompositeTweetPopoverComponent)
      .setBindToRoute(this.router)
      .build();
  }
}
