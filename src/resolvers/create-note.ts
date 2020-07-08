import { Note } from '../models';
import { NoteStore } from '../storage';
import { isString } from 'lodash';
import { TypeResolver } from '.';

export interface NoteInput
{
    content?: string;
    attachment?: string;
}

interface CreateNoteArguments 
{
    input: NoteInput;
}

export const createNote: TypeResolver<Note, CreateNoteArguments> = async ({ 
    input 
}, context) => { 

    const userId = await context.getUserId();
    if (!isString(input.content))
        throw new Error(`The content of a note must be a string got: ${typeof input.content}`);

    const note = new Note(userId);
    note.content = input.content || null;
    note.attachment = input.attachment || null;
    console.log(note);

    return await NoteStore.put(note);
}