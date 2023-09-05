import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@shared/modal/modal.service';
import { IProfile } from '@shared/profile-service/profile.interface';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { CompositeTweetPopoverComponent } from '@shared/tweet/composite-tweet-popover/composite-tweet-popover.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  currentProfile: IProfile | null = null;

  constructor(
    private modalService: ModalService,
    private profile$: ProfilesObservable,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.profile$.subscribe(
      profile => this.currentProfile = profile
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openTweetCompose(): void {
    this.modalService
      .createModal(CompositeTweetPopoverComponent)
      .setBindToRoute(this.router)
      .build();
  }
}
