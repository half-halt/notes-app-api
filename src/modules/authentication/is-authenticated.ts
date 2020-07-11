import { UserContext } from './authentication';
import { UnauthenticatedError } from './unauthenticated-error';
import { authLog } from "./index";

/**
 * Provides the implementation of the '@authenticated' schema directive which verifies
 * if the user has been authenticated. This relies on the context created by the authentication 
 * module. 
 */
export function isAuthenticated()
{
	return ( next: CallableFunction) =>
		function checkAuthentication(root: any, args: any, context: UserContext, info: any)
		{
			if ((typeof(context.isAuthenticated) !== 'boolean') ||
				!context.isAuthenticated)
			{
				authLog.error('Resolver required authentication');
				throw new UnauthenticatedError('User is unauthenticated');
			}

			return next(root, args, context, info);
		}
}