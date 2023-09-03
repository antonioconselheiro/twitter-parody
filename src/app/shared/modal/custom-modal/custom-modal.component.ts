import { Component, HostBinding, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalBuilder } from '../modal.builder';
import { ModalDirective } from '../modal.directive';

@Component({
  selector: 'tw-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent extends ModalDirective {

  tagNameElement = 'tw-custom-modal';
  modalInject$ = ModalBuilder.modalInject$;

  @ViewChild('modalContainer', { read: ViewContainerRef })
  container: ViewContainerRef | null = null;

  override isOpen = false; 

  @HostListener('document:keydown.escape')
  override closeModal(): void {
    super.closeModal();
  }
}
