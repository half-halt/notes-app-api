import { Storage } from './storage-t';
import { Note } from '../models';

class NoteStorage extends Storage<Note> {
	constructor() {
		super('notes', Note);
	}
}

export const NoteStore = new NoteStorage();