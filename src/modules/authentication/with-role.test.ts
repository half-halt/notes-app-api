import log from '~/utils/log';
jest.mock('~/utils/log');
(log.create as jest.Mock).mockImplementation(() => { return log; });
import { withRole } from './with-role';
import { UnauthenticatedError } from './unauthenticated-error';
import { ForbiddenError } from './forbidden-error';
import { AuthenticatedContext, UnauthenticatedContext } from './authentication';

/**
 * Tests the behavior of the 'withRoles' function that implements
 * the @roles() directive in our schemas.
 */
describe('withRole() = @roles directive', () => {
	const unauthenticatedContext: UnauthenticatedContext = {
		isAuthenticated: false
	};

	const authenticatedContext: AuthenticatedContext = {
		isAuthenticated: true,
		userId: 'test-id',
		userRoles:['ADMIN']
	};

	const authenticatedContext2: AuthenticatedContext = {
		isAuthenticated: true,
		userId: 'test-id',
		userRoles:['admin', 'unknown']
	};

	it('throws when not authenticated', () => {
		const next = jest.fn();
		const targetFn = withRole('USER')(next);	
		expect(() => targetFn(null, null, unauthenticatedContext, null)).toThrowError(UnauthenticatedError);
		expect(next).not.toHaveBeenCalled();
		expect(log.error).toHaveBeenCalled();
	}),

	it('throws when role does  not match', () => {
		const next = jest.fn();
		const targetFn = withRole('USER')(next);
		expect(() => targetFn(null, null, authenticatedContext, null)).toThrowError(ForbiddenError);
		expect(next).not.toHaveBeenCalled();
		expect(log.error).toHaveBeenCalled();
	}),

	it('throws when all roles does not match', () => {
		const next = jest.fn();
		const targetFn = withRole(['USER', 'SHOWMGR'])(next);
		expect(() => targetFn(null, null, authenticatedContext, null)).toThrowError(ForbiddenError);
		expect(next).not.toHaveBeenCalled();
		expect(log.error).toHaveBeenCalled();
	}),


	it('succeeds when the role matches', () => {
		const next = jest.fn();
		const targetFn = withRole('ADMIN')(next);
		targetFn(null, null, authenticatedContext, null);
		expect(next).toHaveBeenCalled();
	}),

	it('succeeds when case does not match', () => {
		const next = jest.fn();
		const targetFn = withRole('ADMIN')(next);
		targetFn(null, null, authenticatedContext2, null);
		expect(next).toHaveBeenCalled();
	}),
	
	it('succeeds when one role matches', () => {
		const next = jest.fn();
		const targetFn = withRole(['SHOWMGR', 'ADMIN'])(next);
		targetFn(null, null, authenticatedContext2, null);
		expect(next).toHaveBeenCalled();
	})		
});