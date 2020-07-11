import { Note } from "../../models";
import { NoteStore } from '../../storage';
import { TypeResolver } from '../../resolvers';

export const notes: TypeResolver<Note[]> = async (_, context) => {
	const userId = (context as any).userId;
	const notes = await NoteStore.query({
		KeyConditionExpression: "userId = :userId",
		ExpressionAttributeValues:{
			':userId': userId
		}
	});

	console.log('--> notes have finsihed', notes.length);
	return notes;
}