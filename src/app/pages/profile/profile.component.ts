import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITweet } from '@domain/tweet.interface';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { IProfile } from '@shared/profile-service/profile.interface';

@Component({
  selector: 'tw-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AbstractEntitledComponent implements OnInit {

  override title = 'Profile';

  profile: IProfile | null = null;
  tweets: ITweet[] = [];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  override ngOnInit(): void {
    this.bindTweetSubscription();
    this.getProfileFromActivatedRoute();
    super.ngOnInit();
  }
  
  private bindTweetSubscription(): void {
    const npub = this.activatedRoute.snapshot.params['npub'];
    
  }
  
  private getProfileFromActivatedRoute(): void {
    this.profile = this.activatedRoute.snapshot.data['profile'];
    if (this.profile) {
      this.title = this.profile.display_name || this.profile.name || 'Profile';
    }
  }
}
