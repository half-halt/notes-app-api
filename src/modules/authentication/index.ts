export { UnauthenticatedError } from './unauthenticated-error';
export { ForbiddenError } from './forbidden-error';
export { AuthenticationProvider } from './authentication-provider';
export { AuthenticationModule } from './authentication';
export type { AuthenticatedContext, UnauthenticatedContext, UserContext } from './authentication';

import { log } from '~/utils/log';
export const authLog = log.create('AUTH');
