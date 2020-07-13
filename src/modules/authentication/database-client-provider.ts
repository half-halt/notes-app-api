import 'reflect-metadata';
import { Injectable, ProviderScope } from '@graphql-modules/di';
import LRUCache from 'lru-cache';
import { query as q, Client, values } from 'faunadb';
import  { authLog } from './index';
//@ts-ignore, nano-is has no types
import nanoid from 'nano-id';
import process from 'process';
import { isEmpty, isNil, isString } from 'lodash';
import invariant from 'tiny-invariant';
import chalk from 'chalk';

interface CacheEntry
{
	client: Client;
	userRef: values.Ref;
}

@Injectable({scope: ProviderScope.Application})
export class DatabaseClientProvider
{
	static store = new LRUCache<string, CacheEntry>({
			updateAgeOnGet: true,
			noDisposeOnSet: true,
			maxAge: (1000 * 60 * 60 * 12), // 12 hours
			max: 32,
			dispose: DatabaseClientProvider.logoutClient
		});

	private _admin:Client;
	
	constructor()
	{
		const faunaKey:string = process.env.FAUNADB_SERVER_KEY || process.env.FAUNADB_ADMIN_KEY || '';
		invariant(isString(faunaKey) && !isEmpty(faunaKey), 'No fauna key was provided in the environment');
		this._admin = new Client({
			secret: faunaKey
		});
	}

	/**
	 * Returns true if we already have the specified user in the 
	 * datbase.
	 * 
	 * @param userId The user identifier to check for
	 */
	private async _getRef(userId: string): Promise<values.Ref | null>
	{
		try
		{
			// We don't yet have a client so log one in.
			const user = await this._admin.query<{ ref: values.Ref }>(
					q.Get(
						q.Match(
							q.Index('Users_BySub'),
							userId
						)
					)
				);

			return user.ref;
		}						
		catch (error)
		{
			if (error.message !== 'instance not found')
				throw error;
		}

		return null;
	}

	/**
	 * Creates a new user in the datbase.
	 * 
	 * @param userId The user identifier of the new user
	 * @param password The password (Generated) for this user
	 */
	private _createUser(userId: string, password: string)
	{
		return this._admin.query<values.Ref>(
			q.Select(
				'ref',
				q.Create(
					q.Collection('Users'),
					{
						credentials:
						{
							password
						},
						data: 
						{
							sub: userId
						}
					}
				)
			)
		);
	}

	/**
	 * Update an existing user with a new password. Note: according 
	 * to fauna, this does not invalidate all the tokens for this 
	 * user.
	 * 
	 * TODO: Logout the user first.
	 * 
	 * @param userId The userId to update 
	 * @param password The generated password to assign the user
	 */
	private _updateUser(userRef: values.Ref, password: string)
	{
		return this._admin.query(
			q.Update(
				userRef,
				{
					credentials:
					{
						password
					}
				}
			)
		);

	}

	/**
	 * Creates a cache entry for the user.
	 */
	private async _createCache(userId: string): Promise<CacheEntry>
	{
		// See if we already have a client
		let entry = DatabaseClientProvider.store.get(userId);
		if (!isNil(entry))
		{
			authLog.debug(`Using client from cache '%s'`, chalk.yellow(userId));
			return entry;
		}

		// Generate a unique password
		const generatedPassword = nanoid();
		let userRef = await this._getRef(userId);
		if (isNil(userRef))
		{
			authLog.info('Create new user for \'%s\' in database', chalk.yellow(userId));
			userRef = await this._createUser(userId, generatedPassword);
		}
		else
		{
			authLog.info('Updated user \'%s\' in database', chalk.yellow(userId));
			await this._updateUser(userRef, generatedPassword);
		}

		// Login to create our client.
		authLog.info('Logging user \'%s\' into database', chalk.yellow(userId));
		const token: string = await this._admin.query(
			q.Select('secret',
				q.Login(
					userRef,
					{ 
						password: generatedPassword 
					}
				)
			)
		)
		
		authLog.info('Created new database client for \'%s\'', chalk.yellow(userId));
		entry = {
			userRef,
			client: new Client({ secret: token })
		};

		DatabaseClientProvider.store.set(userId, entry);
		return entry;
	}

	/**
	 *  Gets the reference to current user
	 */
	async getUserRef(userId: string)
	{
		invariant(userId && !isEmpty(userId), 'Invalid user id was passed to getUserRef()');
		const entry = await this._createCache(userId);
		return entry.userRef;
	}

	/**
	 * Gets a database client for the specified userId
	 * 
	 * @param userId 
	 */
	async getClient(userId: string)
	{
		invariant(userId && !isEmpty(userId), 'Invalid user id was passed to getUserRef()');
		const entry = await this._createCache(userId);
		return entry.client;
	}

	/**
	 * Called when an item is remove from the cache, which give us 
	 * a best effort to cleanup the unused tokens.
	 * 
	 * @param userId The user id (key) from the cache
	 * @param client The faunadb client for the user
	 */
	static async logoutClient(userId: string, entry: CacheEntry)
	{
		if (entry)
		{
			await entry.client.query(q.Logout(true));
			authLog.info('Logged \'%s\' of out if the datbase', chalk.yellow(userId));
		}
	}
}