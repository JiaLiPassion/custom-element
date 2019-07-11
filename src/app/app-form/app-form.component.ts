import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-app-form',
  template: `
    <label>{{ label }}</label> <input #input /><button (click)="submit()">Submit</button>
  `,
  styleUrls: ['./app-form.component.css']
})
export class AppFormComponent implements OnInit {
  @Input() label: string;
  @Output() submitted = new EventEmitter();

  @ViewChild('input', { static: true }) input: ElementRef;

  constructor() {}

  ngOnInit() {}

  submit() {
    this.submitted.emit(this.input.nativeElement.value);
  }
}
