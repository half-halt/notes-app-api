import { NoteStore } from '../storage';
import { isNil } from 'lodash';
import { TypeResolver } from '.';

interface DeleteNoteArguments 
{
	noteId: string,
}

export const deleteNote: TypeResolver<boolean, DeleteNoteArguments> = async ({ 
	noteId 
}, context) => { 

	const userId = context.getUserId();
	const note = await NoteStore.get({
		Key:{
			userId,
			noteId
		}
	});

	if (isNil(note)) {
		throw new Error(`Unable to locate note: ${userId}::${noteId}`);	
	}

	return await NoteStore.delete({
		Key:{
			userId,
			noteId
		}
	});
}