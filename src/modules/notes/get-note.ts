import { NoteStore } from '../../storage';
import { Note } from '../../models';
import { isString, isEmpty, isNil } from 'lodash';
import { TypeResolver } from '../../resolvers';
 
interface GetNoteArguments 
{
	noteId: string;
}

export const getNote: TypeResolver<Note, GetNoteArguments> = async ({
	noteId
}, context) => {
	const userId = await context.getUserId();
	if (!isString(noteId) || isEmpty(noteId))
		throw new Error(`An invalid value for 'noteId' was provided: "${String(noteId)}"`);
		
	const note = await NoteStore.get({
		Key:{
			userId,
			noteId
		}
	});

	if (isNil(note))
		throw new Error(`Unable to locate note: ${userId}::${noteId}`);

	return note;
}