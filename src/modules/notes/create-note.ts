import { Note } from '../../models';
//import { NoteStore } from '../../storage';
import { isString } from 'lodash';
import { AuthenticatedContext } from '../authentication';

export interface NoteInput
{
    content?: string;
    attachment?: string;
}

interface CreateNoteArguments 
{
    input: NoteInput;
}

export async function createNote(_parent: any, { input }: CreateNoteArguments, context: AuthenticatedContext)
{
    console.log('create note', input);
    if (!isString(input.content))
        throw new Error(`The content of a note must be a string got: ${typeof input.content}`);

    const note = new Note(context.userId);
    note.content = input.content || null;
    note.attachment = input.attachment || null;
    console.log(note);

    //return await NoteStore.put(note);
    return null;
}