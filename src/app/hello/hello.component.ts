import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent  {
  @Input() name: string;
  @Output() highlight: EventEmitter<string> = new EventEmitter();
  constructor() { }

  click() {
    this.highlight.emit('highlighted');
  }
}
