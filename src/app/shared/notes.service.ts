import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  notes: Note[] = new Array<Note>();

  constructor() {}

  public getAll() {
    return this.notes;
  }

  public get(id: number) {
    return this.notes[id];
  }

  public getId(note: Note) {
    return this.notes.indexOf(note);
  }

  public add(note: Note) {
    // This method will add a note to the notes array and return the id of the note
    //where the id = index
    let newLength = this.notes.push(note);
    let index = newLength - 1;
    return index;
  }

  public update(id: number, title: string, body: string) {
    let note = this.notes[id];
    note.title = title;
    note.body = body;
  }

  public delete(id: number) {
    this.notes.splice(id, 1);
  }
}
