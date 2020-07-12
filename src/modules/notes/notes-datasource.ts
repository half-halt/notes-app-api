import 'reflect-metadata';
import { Injectable, ProviderScope } from '@graphql-modules/di';
import { DatabaseClientProvider } from '~/modules/authentication';
import { ModuleSessionInfo, OnRequest } from '@graphql-modules/core';
import { query as q, values } from 'faunadb';
import { log } from '~/utils/log';
import invariant from 'tiny-invariant';
import { isEmpty, isNil, isString } from 'lodash';

export const notesLog = log.create('notes');

/**
 * Structure of a note from the database.
 */
export interface Note 
{
	ref: values.Ref;
	ts: number;
	data: {
		owner: values.Ref;
		created: number;
		content: string|null;
		attachment: string|null;
	};
};

export interface NoteInput
{
	content?: string,
	attachment?: string
}

@Injectable({ scope: ProviderScope.Session })
export class NotesDataSource implements OnRequest
{
	private notes: Map<string, Note> = new Map<string, Note>();
	private _userId: string | null = null;

	constructor(private clientProvider: DatabaseClientProvider)
	{		
	}

	onRequest(sessionInfo: ModuleSessionInfo)
	{
		this._userId = sessionInfo.context.userId;
		invariant(this._userId, `Context provided an invalid userId`);
	}

	/**
	 * Creates a new note with the given paramters.
	 * 
	 * @param noteInput Paramaters for the new note
	 */
	async create(noteInput: NoteInput)
	{
		try
		{
			const client = await this.clientProvider.getClient(this._userId!);
			const me = await this.clientProvider.getUserRef(this._userId!);

			const note = await client.query<Note>(
				q.Create(
					q.Collection('Notes'),
					{
						permissions:
						{
							read: me,
							delete: me,
							write: me,
						},
						data:
						{
							content: noteInput.content || null,
							attachment: noteInput.attachment || null,
							owner: me,
							created: Date.now()
						}
					}
				)
			)

			// Update our cache to include this note.
			this.notes.set(note.ref.id, note);
			notesLog.debug('User \'%s\' created new note \'%s\'', this._userId, note.ref.id);
			return note;
		}
		catch (error)
		{
			notesLog.error('Failed to create a new note for \'%s\': %s', this._userId, error.message || '');
			notesLog.debug('Exception: %s', error);
			throw error;
		}
	}

	async delete(_noteId: string)
	{

	}

	async update(_noteId: string, _noteInput: NoteInput)
	{

	}

	/**
	 * Gets the not with the specified id.
	 */
	async get(noteId: string)
	{
		invariant(isString(this._userId) && !isEmpty(this._userId), 'NotesDataSource has an invalid user id');
		const note = this.notes.get(noteId);
		if (!isNil(note))
			return note;

		try
		{
			const client = await this.clientProvider.getClient(this._userId!);
			const me = await this.clientProvider.getUserRef(this._userId!);

			const note = await client.query<Note>(
					q.Get(
						q.Match(
							q.Index('Note_ByOwnerAndId'),
							me, 
							q.Ref(q.Collection('Notes'), noteId)
						)
					)
				);

			console.log('note', note);
			return note;
		}
		catch (error)
		{
			if (error.message === 'object not found')
				return null;

			notesLog.error('Failed to query note \'%s\' for user \'%s\'', noteId, this._userId);
			notesLog.debug('Exception:', error);
			throw error;
		}
	}

	async query()
	{

	}
}