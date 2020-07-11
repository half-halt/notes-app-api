import { APIGatewayEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { isString, isEmpty, isNil } from 'lodash';
import { findHeader } from './utils/find-header';
import jwt from 'jsonwebtoken';
import jwkToPem  from 'jwk-to-pem';

const cognitoProvider = new AWS.CognitoIdentityServiceProvider();

/**
 * Interface for the service context (used outside of this file)
 */
export interface Context 
{
	isAuthenticated(): Promise<boolean>;
	getUserId(): Promise<string>;
}

const jwk = {
	keys: [
		{
			alg: "RS256",
			e: "AQAB",
			kid: "C8/jegtKdy1DP2vMJhzfbJKhtjp8qW5lhQbP6rcb7aE=",
			kty: "RSA",
			n:
				"wf1J-WTeUn2KngNEThqeXpWXn6FMo99L90zt3NWxHXjbhnChnVOzWCOupqxoUk8RxmMSTshVb8TJde58Ca-OFgGRgGSSnU3wgar8jLhT8noUpei8AyIboHdZThKI8DVi3rVpuT2dqg2Ov_RFAsezSz8mB28sRqF6BiLW1W1ZWi7MHOuaqw6ASZqIoezNl3EpRyy_UWfuLIBzntveg9-02tKl0W7_qM87Ju8GaG8IYlMiDS3vVGmYKAMfu0zqHg578YOjkvLj_2OCcc2gwbxLnQ5RJV6Y_b14tqCBQNhLlAJ_nNnkP4hnTG2ktC78wvDPxIGRfPhQ222YW2hK5uvaHQ",
			use: "sig",
		},
		{
			alg: "RS256",
			e: "AQAB",
			kid: "Vq6Qog2kx2x1hwfUOI+Wby6Ll/3cSzWkH5HgbtuQpPc=",
			kty: "RSA",
			n:
				"zSdi10U6RNa9p0ZJufTVIn-hDAAdf0SSifyNA9tgr8qj-IwngWE9bbm68-PFiayadyrhWwPUaRVaNUp7i6HogSFjl5TiRGC_LNkSaL6bL8IXcbm7ty8Ivx_ynCOlj1JG8S_odL_3ea3fhuq_0DheI1SDocwjTpTW1HhL7zrQ347mS4cTiJY7_z-pu2qLWzCx1WfzzBYU69FNZNYP7y3MttW-WdUUyv1Qm7ujDeUp1c_vSiQXopHxQhVFUN6lKaFgEXt0K7A2SykAk3GdoJbUFbVp0fcAVcyFdGjgrwfNJwlP-LhhgGMOtuZqZEUM9okN-03xXgc4SnQNK7x-nwagSQ",
			use: "sig",
		},
	],
};

const TOKEN_ISS = 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_9nfnw7an1';
const TOKEN_USE = 'access';
const CLIENT_ID = '19l4efp0l6djp844rl04aotm0j';

function validateTokenClaim<ClaimType extends any>(payload: Record<string, ClaimType>, claim: string, value: ClaimType)
{
	if (!payload || !payload[claim])
		return false;
	console.log('verifyClaim', claim, payload[claim], value);
	return payload[claim] === value;
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

				const decoded: any = jwt.decode(this._token, { complete: true});
				console.log(decoded.header);
				let key = jwk.keys.find(k => decoded.header.kid === k.kid);
				if (!key) throw new Error();
				

				const pem = jwkToPem(key as any);
				const payload = jwt.verify(this._token, pem) as any;
				validateTokenClaim(payload, 'iss', TOKEN_ISS);
				validateTokenClaim(payload, 'client_id', CLIENT_ID);
				validateTokenClaim(payload, 'token_use', TOKEN_USE);

				console.log(payload);


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