import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {

  @Input() title!: string;
  @Input() body!: string;
  @Input() link!: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('truncator', { static: true }) truncator!: ElementRef<HTMLElement>;
  @ViewChild('bodyText', { static: true }) bodyText!: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // work out if there ir a text over and if not, then hide the truncator
    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewwaleHeight = parseInt(style.getPropertyValue('height'), 10);

    if (this.bodyText.nativeElement.scrollHeight > viewwaleHeight) {
      // if there is a text overflow, show the fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      // else (there ir a text overflow), hide the fade ut truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  public onXButtonClick() {
    this.deleteEvent.emit();
  }
}
