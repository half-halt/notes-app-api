import { Note } from '../../models';
import { NoteStore } from '../../storage';
import { isNil } from 'lodash';
import { TypeResolver } from '../../resolvers';
import { NoteInput } from './create-note';

interface UpdateNoteArguments 
{
	noteId: string,
    input: NoteInput
}

export const updateNote: TypeResolver<Note, UpdateNoteArguments> = async ({ 
	input,
	noteId 
}, context) => { 

	const userId = await context.getUserId();
	const note = await NoteStore.get({
		Key:{
			userId,
			noteId
		}
	});

	if (isNil(note)) {
		throw new Error(`Unable to locate note: ${userId}::${noteId}`);	
	}

	note.attachment = input.attachment || null;
	note.content = input.content || null;
	note.setUpdate();

	await NoteStore.update({
		Key: {
			userId,
			noteId
		},
		UpdateExpression: `SET content = :content, #updated = :updated, attachment =  :attachment`,
		ExpressionAttributeNames:{
			'#updated': '_updatedAt'
		},
		ExpressionAttributeValues: {
			':content': note.content,
			':attachment': note.attachment,
			':updated': note.updatedAt.toJSON()
		}
	});
	
    console.log(note);
	return note;
}