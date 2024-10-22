import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@belomonte/async-modal-ngx';
import { CredentialHandlerService } from '@belomonte/nostr-gui-ngx';
import { Account, CurrentAccountObservable } from '@belomonte/nostr-ngx';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { CompositeTweetPopoverComponent } from '@shared/tweet-widget/composite-tweet-popover/composite-tweet-popover.component';
import { Subscription } from 'rxjs';
import { MenuActiveObservable } from '../menu-active.observable';
import { MenuType } from '../menu-type.enum';

@Component({
  selector: 'tw-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  readonly menuTypeHome = MenuType.HOME;
  readonly menuTypeExplore = MenuType.EXPLORE;
  readonly menuTypeNotifications = MenuType.NOTIFICATIONS;
  readonly menuTypeMessages = MenuType.MESSAGES;
  readonly menuTypeLists = MenuType.LISTS;
  readonly menuTypeBookmarks = MenuType.BOOKMARKS;
  readonly menuTypeCommunities = MenuType.COMMUNITIES;
  readonly menuTypeProfile = MenuType.PROFILE;

  account: Account | null = null;
  menuActive: MenuType | null = null;
  
  @ViewChild('authPopover', { read: PopoverComponent })
  popover!: PopoverComponent;

  constructor(
    private modalService: ModalService,
    private profile$: CurrentAccountObservable,
    private menuActive$: MenuActiveObservable,
    private credentialHandlerService: CredentialHandlerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bindProfileSubscription();
    this.bindMenuActiveSubscription();
  }

  private bindProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe(
      account => this.account = account
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

  //  TODO: review this, method purpouse
  onProfileMenuClick(account: Account | null): void {
    if (account) {
      this.popover.show();
    } else {
      this.credentialHandlerService.start();
    }
  }

  addExistingAccount(e: Event): void {
    e.stopPropagation();

    this.credentialHandlerService.selectAccount();
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
