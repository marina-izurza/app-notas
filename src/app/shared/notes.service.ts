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
    // Este método añadirá una nota al array de notas y devolverá el id de la nota donde id = index
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
