import { ApolloError } from 'apollo-server';
import chalk from 'chalk';
import { isString, isEmpty, isNil } from 'lodash';
import { notesLog, NotesModuleContext } from './index';
 
/**
 * Arguments to our 'note' query
 */
export interface GetNoteArguments 
{
	noteId: string;
}

/**
 * Implements our 'note' query resolver.
 * 
 * @param _parent The parent object
 * @param arguments The arguments to the query
 * @param context The current context 
 */
export async function getNote(_parent: any, { noteId }: GetNoteArguments, context: NotesModuleContext)
{
	if (!isString(noteId) || isEmpty(noteId))
	{
		notesLog.error("An invalid 'noteId' argument was passed to getNote(): %s", noteId);
		throw new Error(`An invalid value for 'noteId' was provided: "${String(noteId)}"`);
	}

	let note = null;

	try
	{
		notesLog.debug('Processing getNote(\'%s\') for user \'%s\'', chalk.cyan(noteId), chalk.yellow(context.userId));
		note = context.notesDataSource.get(noteId);
	}
	catch (error)
	{
		throw new ApolloError(`Failed to retrieve note: ${noteId}`, 'GET_NOTE_FAILED');
	}

	if (isNil(note))
	{
		notesLog.error(`Unable to locate note: %s::%s`, context.userId, noteId);
		throw new Error(`Unable to locate note: ${context.userId}::${noteId}`);
	}

	return note;
}