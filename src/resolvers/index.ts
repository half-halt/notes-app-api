import { Context } from '../context';
 
export interface TypeResolver<
	T extends Object, 
	A extends {} = {}
	> extends CallableFunction {
		(args: A, context: Context): Promise<T|null>;
	}