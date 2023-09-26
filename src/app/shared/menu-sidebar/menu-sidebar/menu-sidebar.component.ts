import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthModalComponent } from '@shared/auth-modal/auth-modal.component';
import { ModalService } from '@shared/modal/modal.service';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';
import { CompositeTweetPopoverComponent } from '@shared/tweet-widget/composite-tweet-popover/composite-tweet-popover.component';
import { Subscription } from 'rxjs';
import { MenuActiveObservable } from '../menu-active.observable';
import { MenuType } from '../menu-type.enum';
import { IProfile } from '@domain/profile.interface';

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
  
  @ViewChild('authPopover', { read: PopoverComponent })
  popover!: PopoverComponent;

  constructor(
    private modalService: ModalService,
    private profile$: AuthenticatedProfileObservable,
    private menuActive$: MenuActiveObservable,
    private router: Router
  ) { }

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
    if (profile) {
      this.popover.show();
    } else {
      this.modalService
        .createModal(AuthModalComponent)
        .setTitle('Accounts')
        .setData(null)
        .build();
    }
  }

  addExistingAccount(e: Event): void {
    e.stopPropagation();

    this.modalService
      .createModal(AuthModalComponent)
      .setTitle('Accounts')
      .setData({
        currentAuthProfile: this.profile,
        currentStep: 'add-account'
      })
      .build();

    this.popover.hide();
  }

  logout(e: Event): void {
    e.stopPropagation();

    this.profile$.logout();
    this.popover.hide();
  }

  openTweetCompose(): void {
    this.modalService
      .createModal(CompositeTweetPopoverComponent)
      .setBindToRoute(this.router)
      .build();
  }
}
