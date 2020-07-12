import { isString, isEmpty, isNil } from 'lodash';
import { notesLog, NotesModuleContext } from './index';
 
interface GetNoteArguments 
{
	noteId: string;
}

export async function getNote(_parent: any, { noteId }: GetNoteArguments, context: NotesModuleContext)
{
	if (!isString(noteId) || isEmpty(noteId))
	{
		notesLog.error("An invalid 'noteId' argument was passed to getNote(): %s", noteId);
		throw new Error(`An invalid value for 'noteId' was provided: "${String(noteId)}"`);
	}

	notesLog.debug('Processing getNote(%s)', noteId);
	const note = context.notesDataSource.get(noteId);
	if (isNil(note))
	{
		notesLog.error(`Unable to locate note: %s::%s`, context.userId, noteId);
		throw new Error(`Unable to locate note: ${context.userId}::${noteId}`);
	}

	return note;
}