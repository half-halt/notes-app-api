import { GraphQLModule, ModuleContext } from "@graphql-modules/core";
import { AuthenticatedContext, AuthenticationModule } from "../authentication";
// @ts-ignore
import typeDefs from './notes.gql';
//import { notes } from './notes';
import { NotesDataSource, Note, notesLog } from './notes-datasource';
import { createNote } from './create-note';
import { getNote } from './get-note';

export interface NotesModuleContext extends AuthenticatedContext
{
	notesDataSource: NotesDataSource
}

export const NotesModule = new GraphQLModule({
	typeDefs,
	imports: [AuthenticationModule],
	providers: [NotesDataSource],
	context: (_session, currentContext: ModuleContext) => {
		return {
			notesDataSource: currentContext.injector.get(NotesDataSource)
		} as NotesModuleContext;
	},
	resolvers:{
		Query: {
			note: getNote,
		},
		Mutation: {
			createNote,
		},
		Note: {
			noteId: (note: Note) => note.ref.id,
			ownerId: (note: Note) => note.data.owner.id,
			content: (note: Note) => note.data.content || null,
			attachment: (note: Note) => note.data.attachment || null,
			createdAt: (note: Note) => new Date(note.data.created),
			updatedAt: (note: Note) => new Date(note.ts / 1000)
		}
	},
})

export { notesLog };