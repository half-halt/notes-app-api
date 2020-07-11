import 'reflect-metadata';
import { GraphQLModule } from  '@graphql-modules/core';
//import { get, isString } from 'lodash';
import { NotesModule } from '~/modules/notes';
import 'graphql-iso-date';
import { AuthenticationProvider, AuthenticationModule } from './authentication';


/**
 * This is our Root module, it doesn't do much besides provide context 
 * for the rest of our modules, and import them all.
 */
export const rootModule = new GraphQLModule({
	imports: [AuthenticationModule, NotesModule],
	context: session => session,
	visitSchemaDirectives: true,
	resolversComposition: ({typeDefs, injector}) => {
		const authProvider = injector.get(AuthenticationProvider);
		return authProvider.composeResolvers(typeDefs);
	}
});
