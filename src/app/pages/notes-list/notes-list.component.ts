import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();

  constructor (private notesService: NotesService) { }

  ngOnInit(): void {
    // We want to retreve all notes from NoteService
    this.notes = this.notesService.getAll();
  }

  public deleteNote(id: number) {
    this.notesService.delete(id);
  }
}
