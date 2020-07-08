export { getNote } from './get-note';
export { createNote } from './create-note';
export { notes } from './notes';
export { updateNote } from './update-note';
export { deleteNote } from './delete-note';
import { Context } from '../context';
 
export interface TypeResolver<
	T extends Object, 
	A extends {} = {}
	> extends CallableFunction {
		(args: A, context: Context): Promise<T|null>;
	}