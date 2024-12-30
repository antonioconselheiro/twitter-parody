import { Component, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Component({
  selector: 'tw-popover',
  templateUrl: './popover.component.html',
  host: {
    class: 'popover'
  }
})
export class PopoverComponent {

  @HostBinding('class.active')
  showPopoverAnimating = false;

  @HostBinding('class.removed')
  disablePopover = true;

  @Input()
  selfCloseOnOutClick = false;

  constructor(
    private el: ElementRef
  ) { }

  show(): void {
    this.disablePopover = false;

    //  without the tick the animation transiction does not
    //  occurs because it was in display none
    // eslint-disable-next-line ban/ban
    setTimeout(() => this.showPopoverAnimating = true);
  }

  hide(): void {
    this.showPopoverAnimating = false;
  }

  @HostListener('transitionend', ['$event'])
  onTransitionEnd(): void {
    if (!this.showPopoverAnimating) {
      this.disablePopover = true;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutsidePopover(event: MouseEvent): void {
    if (!this.selfCloseOnOutClick) {
      return;
    }

    const el: HTMLElement | null = this.el?.nativeElement
    const target: HTMLElement | null = event.target as HTMLElement | null;
    if (!el) {
      this.showPopoverAnimating = false;
      return;
    }

    const clickInside = el.contains(target);
    if (!clickInside) {
      this.showPopoverAnimating = false;
    }
  }
}
