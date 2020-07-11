import { ApolloError } from 'apollo-server-lambda';
import { format } from 'util';

/**
 * Error which represents a non-recoverable permission problem
 */
export class ForbiddenError extends ApolloError
{
	constructor(message: string, ...args: any[])
	{
		super(format(message, ...args), 'FORBIDDEN');
	}
}