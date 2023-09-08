import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@shared/modal/modal.service';
import { IProfile } from '@shared/profile-service/profile.interface';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { CompositeTweetPopoverComponent } from '@shared/tweet-widget/composite-tweet-popover/composite-tweet-popover.component';
import { Subscription } from 'rxjs';
import { MenuActiveObservable } from '../menu-active.observable';
import { MenuType } from '../menu-type.enum';
import { AuthModalComponent } from '@shared/security/auth-modal/auth-modal.component';

@Component({
  selector: 'tw-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  readonly MENU_TYPE_HOME = MenuType.HOME;
  readonly MENU_TYPE_EXPLORE = MenuType.EXPLORE;
  readonly MENU_TYPE_NOTIFICATIONS = MenuType.NOTIFICATIONS;
  readonly MENU_TYPE_MESSAGES = MenuType.MESSAGES;
  readonly MENU_TYPE_LISTS = MenuType.LISTS;
  readonly MENU_TYPE_BOOKMARKS = MenuType.BOOKMARKS;
  readonly MENU_TYPE_COMMUNITIES = MenuType.COMMUNITIES;
  readonly MENU_TYPE_PROFILE = MenuType.PROFILE;

  profile: IProfile | null = null;
  menuActive: MenuType | null = null;

  constructor(
    private modalService: ModalService,
    private profile$: ProfilesObservable,
    private menuActive$: MenuActiveObservable,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bindProfileSubscription();
    this.bindMenuActiveSubscription();
  }

  private bindProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe(
      profile => this.profile = profile
    ));
  }

  private bindMenuActiveSubscription(): void {
    this.subscriptions.add(this.menuActive$.subscribe(
      menu => this.menuActive = menu
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onProfileMenuClick(profile: IProfile | null): void {
    if (!profile) {
      this.modalService
        .createModal(AuthModalComponent)
        .setTitle('Accounts')
        .setData(profile)
        .build();
    }
  }

  openTweetCompose(): void {
    this.modalService
      .createModal(CompositeTweetPopoverComponent)
      .setBindToRoute(this.router)
      .build();
  }
}
