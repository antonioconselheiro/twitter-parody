import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITweet } from '@domain/tweet.interface';
import { IProfile } from '@shared/profile-service/profile.interface';

@Component({
  selector: 'tw-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: IProfile | null = null;
  tweets: ITweet[] = [];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bindTweetSubscription();
    this.getProfileFromActivatedRoute();
  }
  
  private bindTweetSubscription(): void {
    const npub = this.activatedRoute.snapshot.params['npub'];
    
  }
  
  private getProfileFromActivatedRoute(): void {
    this.profile = this.activatedRoute.snapshot.data['profile'];
  }
}
