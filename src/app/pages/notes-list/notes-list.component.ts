import {
  animate,
  style,
  transition,
  trigger,
  query,
  stagger,
} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // animacion entry
      transition('void => *', [
        // estado inicial
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          // We hace to 'expand' out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }),
        // First we want to animate the spacinf (wich includes height and margin)
        animate(
          '50ms',
          style({
            height: '*',
            'margin-bottom': '*',
            paddingTop: '*',
            paddingBottom: '*',
            paddingLeft: '*',
            paddingRight: '*',
          })
        ),
        animate(68),
      ]),
      transition('* => void', [
        // first scale up
        animate(
          50,
          style({
            transform: 'scale(1.05)',
          })
        ),
        // the escale down back to normal size while beginning to fade out
        animate(
          50,
          style({
            transform: 'scale(1)',
            opacity: 0.75,
          })
        ),
        // Scale down and fade out completely
        animate(
          '120ms ease-out',
          style({
            transform: 'scale(0.68)',
            opacity: 0,
          })
        ),
        // Them animate the spacing (wich includes height, margin and padding)
        animate(
          '150ms ease-out',
          style({
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 0,
            paddingLeft: 0,
            'margin-bottom': '0',
          })
        ),
      ]),
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({
              opacity: 0,
              height: 0,
            }),
            stagger(100, [animate('0.2s ease')]),
          ],
          {
            optional: true,
          }
        ),
      ]),
    ]),
  ],
})
export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputElRef!: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    // Queremos recuperar todas las notas de NoteService
    this.notes = this.notesService.getAll();
    this.filter('');
  }

  public deleteNote(note: Note) {
    let noteId = this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  public generateNotesURL(note: Note) {
    let noteId = this.notesService.getId(note);
    return noteId;
  }

  public filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();

    // Dividir la consulta de búsqueda en palabras individuales
    let terms: string[] = query.split(' '); // división en espacios

    //eliminar términos de búsqueda duplicados
    terms = this.removeDuplicates(terms);

    //recopilar todos los resultados relevantes en la matriz allResults
    terms.forEach((term) => {
      let results: Note[] = this.relevantNotes(term);

      //añadir los resultados a la matriz allResults
      allResults = [...allResults, ...results];
    });

    // todos los resultados incluirán notas duplicadas
    // porque una nota particular puede ser el resultado
    // de muchos términos de búsqueda, pero no queremos
    // mostrar la misma nota varias veces en la interfaz de
    // usuario por lo que primero debemos eliminar los duplicados
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    // now sort by relevancy
    this.sortByRelevancy(allResults);
  }

  public removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    // recorrer la matriz de entrada y añadir los elementos al set
    arr.forEach((e) => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  public relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter((note) => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });
    return relevantNotes;
  }

  public sortByRelevancy(searchResults: Note[]) {
    // Este método calcula la relevancia de una nota en función del
    // número de veces que aparece en los resultados de búsqueda

    let noteCountObj: Record<number, number> = {};

    searchResults.forEach((note) => {
      let noteId = this.notesService.getId(note); // Get id de las notas

      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1;
      }
    });

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    });
  }
}
