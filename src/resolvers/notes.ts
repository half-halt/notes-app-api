import { Note } from "../models";
import { NoteStore } from '../storage';
import { TypeResolver } from '.';

export const notes: TypeResolver<Note[]> = async (_, context) => {
	const userId = await context.getUserId();
	const notes = await NoteStore.query({
		KeyConditionExpression: "userId = :userId",
		ExpressionAttributeValues:{
			':userId': userId
		}
	});

	console.log('notes', notes);
	return notes;
}