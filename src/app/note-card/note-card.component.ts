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

  @Input('title') title!: string;
  @Input('body') body!: string;
  @Input('link') link!: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('truncator', { static: true }) truncator!: ElementRef<HTMLElement>;
  @ViewChild('bodyText', { static: true }) bodyText!: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    // averiguar si hay un texto encima y si no, ocultar el truncador
    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewaleHeight = parseInt(style.getPropertyValue('height'), 10);

    this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
  }

  public onXButtonClick() {
    this.deleteEvent.emit();
  }
}
