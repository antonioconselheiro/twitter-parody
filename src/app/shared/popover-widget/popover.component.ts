import { Component, ElementRef, HostBinding, HostListener } from '@angular/core';
import { NoteViewModel } from '@view-model/note.view-model';

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

  constructor(
    private el: ElementRef
  ) { }

  show(trigger?: HTMLElement): void {
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

  //@HostListener('document:click', ['$event'])
  onClickOutsidePopover(event: MouseEvent): void {

    const el = this.el?.nativeElement
    if (!el) {
      this.showPopoverAnimating = false;
      return;
    }

    const clickInside = el.contains(event.target as HTMLElement);
    if (!clickInside) {
      this.showPopoverAnimating = false;
    }
  }
}
