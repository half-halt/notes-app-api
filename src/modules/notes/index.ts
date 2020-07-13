import { GraphQLModule, ModuleContext } from "@graphql-modules/core";
import { AuthenticatedContext, AuthenticationModule } from "../authentication";
// @ts-ignore
import typeDefs from './notes.gql';
import { NotesDataSource, Note, notesLog } from './notes-datasource';
import { createNote } from './create-note';
import { listNotes } from './list-notes';
import { getNote } from './get-note';
import { updateNote } from './update-note';
import { deleteNote } from './delete-note';

/**
 * Represtation of the cotnext we consume, defining a customer interface
 * which contains only the set we use makes testing eastier.
 */
export interface NotesModuleContext extends AuthenticatedContext
{
	notesDataSource: NotesDataSource
}

/**
 * Defines the sub-set of our schema which is responsbile for handling our notes.
 * (For this simple server this all we have.)
 */
export const NotesModule = new GraphQLModule({
	typeDefs,
	imports: [AuthenticationModule],
	providers: [NotesDataSource],
	context: async (_session, currentContext: ModuleContext) => {
		return {
			notesDataSource: currentContext.injector.get(NotesDataSource)
		} as NotesModuleContext;
	},
	resolvers:{
		Query: {
			note: getNote,
			notes: listNotes,
		},
		Mutation: {
			createNote,
			updateNote,
			deleteNote,
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