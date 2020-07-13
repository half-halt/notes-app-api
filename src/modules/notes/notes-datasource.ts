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
	attachment: any;
	ref: values.Ref;
	ts: number;
	data: {
		owner: values.Ref;
		created: number;
		content: string|null;
		attachment: string|null;
	};
};

/**
 * Structure of the input to create/modify a note.
 */
export interface NoteInput
{
	content?: string,
	attachment?: string
}

/**
 * Handles reading/writing data to and from the database for our 'note' objects
 */
@Injectable({ scope: ProviderScope.Session })
export class NotesDataSource implements OnRequest
{
	private _notes: Map<string, Note> = new Map<string, Note>();
	private _userId: string | null = null;

	/**
	 * Ctor
	 */
	constructor(private clientProvider: DatabaseClientProvider)
	{		
	}

	/**
	 * Called when a new request has arrived, allows is to get the 
	 * userId and create our datbase client.
	 */
	async onRequest(sessionInfo: ModuleSessionInfo)
	{
		if (sessionInfo.context.isAuthenticated)
		{
			// get our user and prime the cache
			this._userId = sessionInfo.context.userId;
			await this.clientProvider.getUserRef(this._userId!);
		}
	}

	/**
	 * Creates a new note with the given paramters.
	 * 
	 * @param noteInput Paramaters for the new note
	 */
	async create(noteInput: NoteInput)
	{
		invariant(isString(this._userId) && !isEmpty(this._userId), 'NotesDataSource has an invalid user id');

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
			this._notes.set(note.ref.id, note);
			return note;
		}
		catch (error)
		{
			notesLog.error('Failed to create a new note for \'%s\': %s', this._userId, error.message || '');
			notesLog.debug('Exception: %s', error);
			throw error;
		}
	}

	/**
	 * Deletes the provided notes from the store.
	 */
	async delete(noteId: string)
	{
		invariant(isString(this._userId) && !isEmpty(this._userId), 'NotesDataSource has an invalid user id');
		invariant(!isEmpty(noteId), 'Invalid noteId was specified to \'delete\'')

		try 
		{
			const client = await this.clientProvider.getClient(this._userId);
			await client.query(
				q.Delete(
					q.Ref(q.Collection('Notes'), noteId)
				)
			)

			this._notes.delete(noteId);
		}
		catch (error)
		{
			if ((error.message === 'invalid ref') ||
				(error.message === 'instance not found'))
				return;

			notesLog.error('Failed to delete note \'%s\' for \'%s\': %s', noteId, this._userId, error.message || '');
			notesLog.debug('Exception: %s', error);
			throw error;
		}		
	}

	/**
	 * Update the specified note with new parameters.
	 */
	async update(noteId: string, noteInput: NoteInput)
	{
		invariant(isString(this._userId) && !isEmpty(this._userId), 'NotesDataSource has an invalid user id');

		try 
		{
			const client = await this.clientProvider.getClient(this._userId);
			const note = await client.query<Note>(
				q.Update(
					q.Ref(q.Collection('Notes'), noteId),
					{
						data:{
							content: noteInput.content || null,
							attachment: noteInput.attachment || null
						}
					}
				)
			)

			this._notes.set(note.ref.id, note);
			return note;
		}
		catch (error)
		{
			notesLog.error('Failed to create a new note for \'%s\': %s', this._userId, error.message || '');
			notesLog.debug('Exception: %s', error);
			throw error;
		}
	}

	/**
	 * Gets the not with the specified id.
	 */
	async get(noteId: string)
	{
		invariant(isString(this._userId) && !isEmpty(this._userId), 'NotesDataSource has an invalid user id');
		invariant(!isEmpty(noteId), 'Invalid noteId was specified to \'delete\'')

		const note = this._notes.get(noteId);
		if (!isNil(note))
		{
			notesLog.debug('Used note \'%s\' from the data source cache', note.ref.id);
			return note;
		}

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

			this._notes.set(note.ref.id, note);
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

	/**
	 * Queries the datasource for notes.
	 */
	async query()
	{
		invariant(isString(this._userId) && !isEmpty(this._userId), 'NotesDataSource has an invalid user id');

		// Query clears the cache
		this._notes.clear();
		try 
		{
			const client = await this.clientProvider.getClient(this._userId);
			const me = await this.clientProvider.getUserRef(this._userId);

			const results = await client.query<{data: Note[]}>(
					q.Map(
						q.Paginate(
							q.Match(
								q.Index('Notes_ByOwner'),
								me
							)
						),
						ref => q.Get(ref)
					)
				);
			
			results.data.forEach(note => this._notes.set(note.ref.id, note));
			return results.data;
		}
		catch (error)
		{
			notesLog.error('Failed to query notes  user \'%s\'', this._userId);
			notesLog.debug('Exception:', error);
			throw error;
		}
	}
}