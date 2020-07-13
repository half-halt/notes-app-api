import { UserContext } from './authentication';
import { UnauthenticatedError } from './unauthenticated-error';
import { ForbiddenError } from './forbidden-error';
import { authLog } from "./index";

export function withRole(roles: string[]|string)
{
	return ( next: CallableFunction) =>
		function validateRole(root: any, args: any, context: UserContext, info: any)
		{
			// Step 1: Verify the user is authenticated to ensure that we've got
			// the roles array.
			if ((typeof(context.isAuthenticated) !== 'boolean') || !context.isAuthenticated)
			{
				authLog.error('Resolver required authentication');
				throw new UnauthenticatedError('User is unauthenticated');
			}

			// Make sure we have a proper argument
			const required = (typeof(roles) === 'string') ? [roles] : roles;
			if (!Array.isArray(required))
				throw new TypeError(`Expected user roles to be string[]|string but got: ${typeof(roles)}`);

		
			// See if the user has the role, If the user does not have
			// a list of roles, then we assume the don't have permission.
			if (!Array.isArray(context.userRoles))
			{
				const rolesStr = roles.toString();
				authLog.error('User does not have roles, [%s] are required.', rolesStr);
				throw new ForbiddenError('Forbidden - User has does not have any roles [%s] required', rolesStr);
			}

			const role = context.userRoles.find(role => roles.includes(role.toUpperCase()));
			if (typeof(role) !== 'string')
			{
				const rolesStr = roles.toString();
				const userRolesStr = context.userRoles.toString();
				authLog.error('User roles [%s] do not overlap with required roles [%s]', userRolesStr, rolesStr);
				throw new ForbiddenError('Forbidden - User roles [%s] does not have the required roles [%s]', userRolesStr, rolesStr);
			}

			return next(root, args, context, info);
		}
}