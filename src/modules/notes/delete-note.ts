import { ApolloError } from 'apollo-server';
import chalk from 'chalk';
import { notesLog, NotesModuleContext } from './index';
import * as yup from 'yup';

/**
 * Arguments for our resolver
 */
interface DeleteNoteArguments 
{
	noteId: string,
}

const deleteSchema = yup.object().shape({
		noteId: yup.string()
			.required("the required noteId argument for deleteNote was missing")
			.matches(/^[0-9]+$/, "The 'noteId' argument for deleteNote is invalid")
	})
	.required('No arguments were specified to \'deleteNote\'')

/**
 * Implements our 'deleteNote' mutation.
 * 
 * @param _parent The parent object
 * @param arguments The arguments to the mutation
 * @param context The current context 
 */
export async function deleteNote(_parent: any, args: DeleteNoteArguments, context: NotesModuleContext)
{
	deleteSchema.validateSync(args);

	try
	{
		notesLog.debug('Processing deleteNote(\'%s\') for user \'%s\'', chalk.cyan(args.noteId), chalk.yellow(context.userId));
		await context.notesDataSource.delete(args.noteId);
		notesLog.info("User '%s' deleted note '%s'", chalk.yellow(context.userId), chalk.cyan(args.noteId));
		return true;
	}
	catch (error)
	{
		throw new ApolloError(`Failed to delete note: ${args.noteId}`, 'DELETE_NOTE_FAILED');
	}

	return false;
}