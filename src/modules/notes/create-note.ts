import { NoteInput } from './notes-datasource';
import { NotesModuleContext, notesLog } from './index';
import { isNil } from 'lodash';
import { ApolloError } from 'apollo-server';
import chalk from 'chalk';

/**
 * Type we expect as arguments to the mutation.
 */
export interface CreateNoteArguments 
{
    input: NoteInput;
}

/**
 * Implements the 'createNote' mutation. 
 * 
 * @param _parent The root object
 * @param arguments The arguments passed to the mutation
 * @param context The context we are running in
 */
export async function createNote(_parent: any, { input }: CreateNoteArguments, context: NotesModuleContext)
{
    if (isNil(input))
    {
        notesLog.error(`An invalid argument was passed to createNote(): %s`, input);
        throw new TypeError('Invalid argument was passed to createNote');
    }

    try 
    {
        const note = await context.notesDataSource.create(input);
        notesLog.debug(`User '%s' created note '%s`, chalk.yellow(context.userId), chalk.cyan(note.ref.id))
        return note;
    }
    catch (error)
    {
        throw new ApolloError('Failed to create a new note.', 'CREATE_NOTE_ERROR')
    }
}