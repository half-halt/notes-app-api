import { GraphQLModule } from '@graphql-modules/core';
import jwt from 'jsonwebtoken';
import jwkToPem, { JWK } from 'jwk-to-pem';
import { AuthenticationProvider } from './authentication-provider';
import { DatabaseClientProvider } from './database-client-provider';
import { authLog } from "./index";
//@ts-ignore
import typeDefs from './auth.gql'; 

const TOKEN_ISS = 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_9nfnw7an1';
const TOKEN_USE = 'access';
const CLIENT_ID = '19l4efp0l6djp844rl04aotm0j';

/* cspell:disable */
const SERVICE_KEYS = [
	{
		alg: "RS256",
		e: "AQAB",
		kid: "C8/jegtKdy1DP2vMJhzfbJKhtjp8qW5lhQbP6rcb7aE=",
		kty: "RSA",
		n: "wf1J-WTeUn2KngNEThqeXpWXn6FMo99L90zt3NWxHXjbhnChnVOzWCOupqxoUk8RxmMSTshVb8TJde58Ca-OFgGRgGSSnU3wgar8jLhT8noUpei8AyIboHdZThKI8DVi3rVpuT2dqg2Ov_RFAsezSz8mB28sRqF6BiLW1W1ZWi7MHOuaqw6ASZqIoezNl3EpRyy_UWfuLIBzntveg9-02tKl0W7_qM87Ju8GaG8IYlMiDS3vVGmYKAMfu0zqHg578YOjkvLj_2OCcc2gwbxLnQ5RJV6Y_b14tqCBQNhLlAJ_nNnkP4hnTG2ktC78wvDPxIGRfPhQ222YW2hK5uvaHQ",
		use: "sig",
	},
	{
		alg: "RS256",
		e: "AQAB",
		kid: "Vq6Qog2kx2x1hwfUOI+Wby6Ll/3cSzWkH5HgbtuQpPc=",
		kty: "RSA",
		n: "zSdi10U6RNa9p0ZJufTVIn-hDAAdf0SSifyNA9tgr8qj-IwngWE9bbm68-PFiayadyrhWwPUaRVaNUp7i6HogSFjl5TiRGC_LNkSaL6bL8IXcbm7ty8Ivx_ynCOlj1JG8S_odL_3ea3fhuq_0DheI1SDocwjTpTW1HhL7zrQ347mS4cTiJY7_z-pu2qLWzCx1WfzzBYU69FNZNYP7y3MttW-WdUUyv1Qm7ujDeUp1c_vSiQXopHxQhVFUN6lKaFgEXt0K7A2SykAk3GdoJbUFbVp0fcAVcyFdGjgrwfNJwlP-LhhgGMOtuZqZEUM9okN-03xXgc4SnQNK7x-nwagSQ",
		use: "sig",
	},
];
/* cspell:enable */

/**
 * 
 * @param token 
 */
function findSecretForToken(token: string)
{
	// Use JWT decode to decode the token, This data is un-trusted at this point, 
	// but we need to figure out which key we need to use for verification and this
	// beats rolling our own decoded.
	const decoded = jwt.decode(token, { complete: true});
	if (!decoded || (typeof(decoded) !== 'object'))
		throw new Error(`Unable to decode the Token`);

	const header: any = decoded.header;
	if (!header || (typeof(header) !== 'object') || !header.kid || (typeof(header.kid) !== 'string'))
		throw new Error(`User token in invalid.`)

	const jwk = SERVICE_KEYS.find(key => (decoded.header.kid === key.kid));
	return (jwk ? jwkToPem(jwk as JWK) : null);
}

/**
 * 
 * @param payload 
 * @param claim 
 * @param value 
 */
function validateTokenClaim<ClaimType extends any>(payload: Record<string, ClaimType>, claim: string, value: ClaimType)
{
	if (!payload || !payload[claim])
		throw new Error(`Token is missing Claim=${claim}`);

	if (payload[claim] !== value)
		throw new Error(`Token has invalid Claim=${claim}`);
}

/**
 * 
 * @param headers 
 */
function getAuthToken(headers: Record<string, string>)
{
	if (!headers)
		return null;

	for (const header in headers)
	{
		if (header.toLowerCase() === 'authorization')
		{
			const value = headers[header];
			if (!value.startsWith('Bearer '))
				return null;

			return value.substr(6).trim();
		}
	}

	return null;
}

export interface UnauthenticatedContext
{
	isAuthenticated: false;
}

export interface AuthenticatedContext
{
	isAuthenticated: true;
	userId: string;
	userRoles: string[]
}

export type UserContext = UnauthenticatedContext|AuthenticatedContext;

export const AuthenticationModule  = new GraphQLModule({
	typeDefs,
	providers: [AuthenticationProvider, DatabaseClientProvider],
	context: ({event}): UserContext => {
		try 
		{
			const token = getAuthToken(event.headers);
			if (token)
			{
				const secret = findSecretForToken(token);
				if (!secret)
					throw new Error(`Token has an invalid key identifier`);

				const payload = jwt.verify(token, secret) as any;
				validateTokenClaim(payload, 'iss', TOKEN_ISS);
				validateTokenClaim(payload, 'client_id', CLIENT_ID);
				validateTokenClaim(payload, 'token_use', TOKEN_USE);

				if (!payload['sub'] || (typeof(payload['sub']) !== 'string'))
					throw new Error(`Token has invalid 'sub' property`);

				return {
					isAuthenticated: true,
					userId: payload['sub'],
					userRoles: payload['cognito:groups'] || []
				};
			}
		}
		catch (error)
		{
			console.warn('Unable to authenticate user:', error.message || String(error));
			console.log(error);
		}

		return {
			isAuthenticated: false
		}
	},
});

export { authLog };