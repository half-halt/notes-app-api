import { ApolloError } from 'apollo-server';
import chalk from 'chalk';
import { notesLog, NotesModuleContext } from './index';
import { Note } from './notes-datasource';
 
/**
 * Implements our 'notes' query resolver
 * 
 * @param _parent The parent object
 * @param arguments The arguments to the query
 * @param context The current context 
 */
export async function listNotes(_parent: any, _arguments: any, context: NotesModuleContext)
{
	let notes: Note[] = [];

	try
	{
		notesLog.debug('Processing listNotes() for user \'%s\'', chalk.yellow(context.userId));
		notes = await context.notesDataSource.query();
	}
	catch (error)
	{
		throw new ApolloError(`Failed to list notes`, 'LIST_NOTES_FAILED');
	}

	return notes;
}