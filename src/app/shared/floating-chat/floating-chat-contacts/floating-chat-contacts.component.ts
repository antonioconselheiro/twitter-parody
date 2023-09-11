/* eslint-disable max-lines */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProfile } from '@shared/profile-service/profile.interface';
import { IMessage } from '../message.interface';
import { NostrUser } from '@domain/nostr-user';
import { DataLoadType } from '@domain/data-load-type';

@Component({
  selector: 'tw-floating-chat-contacts',
  templateUrl: './floating-chat-contacts.component.html',
  styleUrls: ['./floating-chat-contacts.component.scss']
})
export class FloatingChatContactsComponent {

  @Output()
  choose = new EventEmitter<IProfile>();

  @Output()
  collapse = new EventEmitter<boolean>();

  @Input()
  collapsed = true;

  @Input()
  contacteds: IMessage[] = [
    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    },

    {
      text: 'Mensagem mock',
      time: 1684022601,
      author: {
        npub: 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf',
        user: new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'),
        name: 'Exemplo',
        display_name: 'Jorge',
        picture: 'https://nostr.build/i/nostr.build_aae6c5ca6098ac5c3e4e4ba5b6fbb8808cecc0f45edaab12a0a3d59f14e8a09b.png',
        nip05: 'exemplo@iris.to',
        nip05valid: true,
        load: DataLoadType.EAGER_LOADED
      }
    }
  ];
}
