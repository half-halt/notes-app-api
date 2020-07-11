export { getNote } from '../modules/notes/get-note';
export { createNote } from '../modules/notes/create-note';
export { notes } from '../modules/notes/notes';
export { updateNote } from '../modules/notes/update-note';
export { deleteNote } from '../modules/notes/delete-note';
import { Context } from '../context';
 
export interface TypeResolver<
	T extends Object, 
	A extends {} = {}
	> extends CallableFunction {
		(args: A, context: Context): Promise<T|null>;
	}