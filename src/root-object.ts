import { notes, getNote, createNote, updateNote, deleteNote } from './resolvers';

export const root = {
    createNote,
    note: getNote,
    notes,
    updateNote,
    deleteNote
};