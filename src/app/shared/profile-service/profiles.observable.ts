import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProfile } from './profile.interface';

/**
 * O observable principal da classe emite os metadados do perfil autenticado
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilesObservable extends Subject<IProfile | null> {

  static instance: ProfilesObservable | null = null;

  constructor() {
    super();
    if (!ProfilesObservable.instance) {
      ProfilesObservable.instance = this;
    }

    return ProfilesObservable.instance;
  }

  getMetadataFromNostrPublic(npub: string): IProfile {
    return { npub };
  }
}
