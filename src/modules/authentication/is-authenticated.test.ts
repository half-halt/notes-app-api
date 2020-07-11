import log from '~/utils/log';
jest.mock('~/utils/log');
(log.create as jest.Mock).mockImplementation(() => { return log; });

import { isAuthenticated } from './is-authenticated';
import { UnauthenticatedError } from './unauthenticated-error';
import { AuthenticatedContext, UnauthenticatedContext } from './authentication';

/**
 * Tests the behavior of 'isAuthenticated(), which implements
 * our '@authenticated' directive
 */
describe('isAuthenticated() = @authenticated directive', () => {
	const unauthenticatedContext: UnauthenticatedContext = {
		isAuthenticated: false
	};

	const authenticatedContext: AuthenticatedContext = {
		isAuthenticated: true,
		userId: 'test-id',
		userRoles:[]
	};

	it('throws when not authenticated', () => {
		const next = jest.fn();
		const targetFn = isAuthenticated()(next);	
		expect(() => targetFn(null, null, unauthenticatedContext, null)).toThrowError(UnauthenticatedError);
		expect(next).not.toHaveBeenCalled();
	}),

	it('Logs an error when not authenticated', () => {
		const next = jest.fn();
		const targetFn = isAuthenticated()(next);
		try 
		{
			targetFn(null, null, unauthenticatedContext, null);
		} 
		catch (e) 
		{}

		expect(log.error).toHaveBeenCalled();
	}),

	it('Calls next() when the user is authenticated', () => {
		const next = jest.fn();
		const targetFn = isAuthenticated()(next);
		targetFn(null, null, authenticatedContext, null);
		expect(next).toHaveBeenCalled();
	})
});