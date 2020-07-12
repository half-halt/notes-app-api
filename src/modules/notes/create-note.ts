import { NoteInput } from './notes-datasource';
import { NotesModuleContext, notesLog } from './index';
import { isNil } from 'lodash';

interface CreateNoteArguments 
{
    input: NoteInput;
}

export async function createNote(_parent: any, { input }: CreateNoteArguments, context: NotesModuleContext)
{
    if (isNil(input))
    {
        notesLog.error(`An invalid argument was passed to createNote(): %s`, input);
        throw new TypeError('Invalid argument was passed to createNote');
    }

    return await context.notesDataSource.create(input);
}