import { ApolloError } from 'apollo-server-lambda';
import { format } from 'util';

/**
 * Error which represents the user unauthenticated. 
 */
export class UnauthenticatedError extends ApolloError
{
	constructor(message: string, ...args: any[])
	{
		super(format(message, ...args), "UNAUTHENTICATED");
	}
}