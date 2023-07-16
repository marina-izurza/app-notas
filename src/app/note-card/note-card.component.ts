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
    // averiguar si hay un texto encima y si no, ocultar el truncador
    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewwaleHeight = parseInt(style.getPropertyValue('height'), 10);

    if (this.bodyText.nativeElement.scrollHeight > viewwaleHeight) {
      // si hay desbordamiento de texto, mostrar el truncador de desvanecimiento
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      // else (hay texto que desborda), ocultar el truncador fade ut
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  public onXButtonClick() {
    this.deleteEvent.emit();
  }
}
