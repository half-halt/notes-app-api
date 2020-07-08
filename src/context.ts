import { APIGatewayEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { isString, isEmpty, isNil } from 'lodash';
import { findHeader } from './utils/find-header';

const cognitoProvider = new AWS.CognitoIdentityServiceProvider();

/**
 * Interface for the service context (used outside of this file)
 */
export interface Context 
{
	isAuthenticated(): Promise<boolean>;
	getUserId(): Promise<string>;
}

/**
 * Implementation of the service context.  Right now this extracts 
 * the user infromation to provide authentication information.
 */
export class ServiceContext  {
	private _token: string|null = null;
	private _user: AWS.CognitoIdentityServiceProvider.GetUserResponse|null = null;
	private _checkedUser: boolean = false;

	constructor(event: APIGatewayEvent) {
		// Check for our authorization header, if it's present store it
		// so we can use it later if necessary.
		const authorization = findHeader(event.headers, 'authorization');
		if (isString(authorization) && authorization.startsWith('Bearer')) {
			this._token = authorization.substr(6).trim();
		}
	}

	// Intenral function which retrieves the user from the Congnito service
	// if it has not already been checked.
	private async _getUser() {
		if (this._token && !this._checkedUser) {
			try {
				const params = { AccessToken: this._token };
				this._user = await cognitoProvider.getUser(params).promise();
			} catch (error) {
				this._user = null;
			}
			this._checkedUser = true;
		}

		return this._user;
	}

	/**
	 * Returns true if we have an authenticated user
	 */
	async isAuthenticated() {
		const user = await this._getUser();
		return (!isNil(user) && isString(user.Username) && !isEmpty(user.UserAttributes));
	}

	/**
	 * Retrieves the user id for our user, returns null if we don't already
	 * have an authenticated user, if we do it returns unique indentifier for 
	 * the specified user.
	 */
	async getUserId() {
		const authenticated = await this.isAuthenticated();
		if (!authenticated || (this._user === null))
		{
			throw new Error(`Unauthorized`);
		}

		const sub = this._user!.UserAttributes.find((attr => attr.Name === 'sub'));
		if (isNil(sub) || isEmpty(sub.Value)) 
		{
			throw new Error('Unauthorized');
		}

		return sub.Value;
	}
}