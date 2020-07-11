import { GraphQLModule } from "@graphql-modules/core";
import { AuthenticationModule, AuthenticatedContext } from "../authentication";
// @ts-ignore
import typeDefs from './notes.gql';
import { notes } from './notes';
import { createNote } from './create-note';

export const NotesModule = new GraphQLModule({
	typeDefs,
	imports: [AuthenticationModule],
	context: session => session,
	resolvers: {
		Query: {
			notes: async (_root: any, _args: any, context: AuthenticatedContext) => {
				console.log('notesModule: userId=', context.userId);
				console.log('notesModule: userRoles=', context.userRoles);
				return notes({}, context as any);
			}
		},
		Mutation: {
			createNote
		}
	},
})