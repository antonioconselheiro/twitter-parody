import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ITheme } from '@shared/theme/theme.interface';
import { ThemeObservable } from '@shared/theme/theme.observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-tweet-write-button-group',
  templateUrl: './tweet-write-button-group.component.html',
  styleUrls: ['./tweet-write-button-group.component.scss']
})
export class TweetWriteButtonGroupComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  private currentTheme: ITheme | null = null;

  @Output()
  emoji = new EventEmitter<string>();

  @ViewChild('emojiMart', { read: ElementRef })
  private emojiMart!: ElementRef; 

  emojiMartOpen = false;

  constructor(
    private theme$: ThemeObservable
  ) {}

  ngOnInit(): void {
    this.subscribeInThemes();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: PointerEvent): void {
    const picker: HTMLElement = this.emojiMart.nativeElement;
    const target = event.target as HTMLElement;
    if (!picker.contains(target) && this.emojiMartOpen) {
      this.emojiMartOpen = false;
    }
  }
  
  private subscribeInThemes(): void {
    this.subscriptions.add(this.theme$.subscribe({
      next: theme => this.currentTheme = theme
    }));
  }

  isDarkMode(): boolean {
    return this.currentTheme?.base !== 'light';
  }

  toggleEmojiMart(): void {
    //  deixando o evento de click ser processado antes de mudar a informação
    //  caso contrário será identificado um click fora do modal de emojis e
    //  ele fechará; o timeout está com 0 millisegundos, então está como
    //  primeiro da fila após todos os processos disparados neste tick sejam
    //  executado
    // eslint-disable-next-line ban/ban
    setTimeout(() => this.emojiMartOpen = !this.emojiMartOpen);
  }

  addEmoji({ emoji: { native } }: { emoji: { native: string } }): void {
    this.emoji.emit(native);
  }
}
