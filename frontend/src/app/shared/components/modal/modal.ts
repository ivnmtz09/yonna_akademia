import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
})
export class Modal {
  isOpen = input.required<boolean>();
  closeModal = output<void>();

  onClose() {
    this.closeModal.emit();
  }
}
