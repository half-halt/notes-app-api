import { ApolloError } from 'apollo-server';
import chalk from 'chalk';
import { notesLog, NotesModuleContext } from './index';
import { Note } from './notes-datasource';
import { values } from 'faunadb';
import * as Yup from 'yup';

/**
 * Interface used to describe our notes summary
 */
export interface NoteSummary
{
	hasAttachment: boolean;
	summary: string;
	ref: values.Ref;
	ts: number;
}

/**
 * Interface used to describe our arguments 
 */
export interface RecentNotesArguments
{
	max?: number;
}

/**
 * Schema used to validate our arguments
 */
const validateSchema = Yup.object().shape({
		max: Yup.number()
			.notRequired()
			.integer('The value of the \'max\' parameter must be an integer.')
			.positive('The value of \'max\' is invalid, it must be a positive integer.')
	})
	.notRequired();
 
/**
 * Generates a preview line from the specified note
 * 
 * @param note The note to genate a preview from
 */
export function createNotePreview(note: Note)
{
	const { content } = note.data;

	if ((typeof(content) !== 'string') || (content.length === 0))
		return '';

	const normalized = content.trim();
	const firstLine = normalized.indexOf('\n');
	if ((firstLine < 0) || (normalized.length - firstLine <= 0))
		return content.trim();

	return `${normalized.substr(0, firstLine)}...`;
}

/**
 * Implements our 'recent' query resolver
 * 
 * @param _parent The parent object
 * @param arguments The arguments to the query
 * @param context The current context 
 */
export async function recentNotes(_parent: any, args: RecentNotesArguments, context: NotesModuleContext)
{
	validateSchema.validateSync(args);

	try
	{
		notesLog.debug('Processing recent() for user \'%s\'', chalk.yellow(context.userId));
		let notes = await context.notesDataSource.query();

		// Sort by modification date
		notes.sort((a, b) => {
			return (b.ts - a.ts);
		});

		// Prune extra notes.
		if ((typeof(args.max) === 'number') && (notes.length > args.max))
			notes = notes.slice(0, args.max);

		const summaries = notes.reduce(
			(list: NoteSummary[], note: Note) => {
				list.push({
					ref: note.ref,
					ts: note.ts,
					hasAttachment: (typeof(note.data.attachment) === 'string') && 
						(note.data.attachment.length !== 0),
					summary: createNotePreview(note)
				})
				return list;
			}, [] as NoteSummary[]);

		notesLog.debug("Recent notes returning %s notes for user '%s'", 
			chalk.magenta(String(summaries.length)), chalk.yellow(context.userId));

		return summaries;
	}
	catch (error)
	{
		throw new ApolloError(`Failed to list notes`, 'RECENT_NOTE_FAILURE');
	}
}