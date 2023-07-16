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
      // entry animation
      transition('void => *', [
        // initial state
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          // We hace to 'expand' out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }),
        // First we want to animate the spacinf (wich includes height and margin)
        animate(
          '50ms',
          style({
            height: '*',
            'margin-bottom': '*',
            paddingTop: '*',
            paddingBottom: '*',
            paddingRight: '*',
            paddingLeft: '*',
          })
        ),
        animate(100),
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
            opacity: 0,
            transform: 'scale(0.68)',
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
    // We want to retreve all notes from NoteService
    this.notes = this.notesService.getAll();
    // this.filteredNotes = this.notesService.getAll();
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

    // Split up the search query into individual words
    let terms: string[] = query.split(' '); // split on spaces

    //remove duplicate search terms
    terms = this.removeDuplicates(terms);

    //compile all relevant results into de allResults array
    terms.forEach((term) => {
      let results: Note[] = this.relevantNotes(term);

      //append results to the allResults array
      allResults = [...allResults, ...results];
    });

    // all results will include duplicate notes
    // because a aprticular note can be the result of many search terms
    // but we dont want yo show the same note multiple times on the UI
    // so we first must remove the duplicates
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    // now sort by relevancy
    this.sortByRelevancy(allResults);
  }

  public removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    // loop through the input array and add the items yo yhe set
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
    // This mehod will calculate the relevancy of a note
    // based on the number of times it appears in the search results

    let noteCountObj: Record<number, number> = {};

    searchResults.forEach((note) => {
      let noteId = this.notesService.getId(note); // Get the notes id

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
