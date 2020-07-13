import { NoteInput } from './notes-datasource';
import { NotesModuleContext, notesLog } from './index';
import { ApolloError } from 'apollo-server';
import * as yup from 'yup';
import chalk from 'chalk';

/**
 * Type we expect as arguments to the mutation.
 */
interface UpdateNoteArguments 
{
	noteId: string,
    input: NoteInput
}

// Verifies thew structure of our input arguments
const argumentsSchema = yup.object().shape({
		noteId: yup.string()
			.required('The \'noteId\' argument was unspecified for \'updateNote\'')
			.matches(/^[0-9]+$/, 'The \'noteId\' argument for \'updateNote\' was invalid'),
		input: yup.object().shape({
			content: yup.string().optional(),
			attachment: yup.string().optional(),
		})
		.required('No \'input\' argument was specified for \'updateNote\'')
	})
	.required('No argument were specified to \'updateNote\'');

/**
 * Implements the 'updateNote' mutation. 
 * 
 * @param _parent The root object
 * @param arguments The arguments passed to the mutation
 * @param context The context we are running in
 */
export async function updateNote(_parent: any, args: UpdateNoteArguments, context: NotesModuleContext)
{
	// todo would like promote validation errors a code in the output
	await argumentsSchema.validate(args);
	const { noteId, input }	= args;

    try 
    {
		notesLog.debug("Processing updateNote('%s') for user '%s'", chalk.cyan(noteId), chalk.yellow(context.userId));
        const note = await context.notesDataSource.update(noteId, input);
        return note;
    }
    catch (error)
    {
        throw new ApolloError(`Failed to update note: ${noteId}`, 'UPDATE_NOTE_ERROR')
    }
}