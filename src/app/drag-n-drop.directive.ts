import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
})
export class DragDropDirective {
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') background = '#FFFFFF';
  @HostBinding('style.opacity') opacity = '1';

  @HostListener('dragover', ['$event']) onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    this.background = '#CBE9F6';
    this.opacity = '0.6';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    this.background = '#FFFFFF';
    this.opacity = '1';
  }

  @HostListener('drop', ['$event']) public ondrop(event) {
    event.preventDefault();
    event.stopPropagation();

    this.background = '#FFFFFF';
    this.opacity = '1';

    const files = event.dataTransfer.files;

    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }
}
