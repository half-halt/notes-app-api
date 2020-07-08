import { APIGatewayEvent } from 'aws-lambda';
import { graphql, buildASTSchema } from 'graphql';
import { isNil, get, isString, isEmpty } from 'lodash';
import { root } from './root-object';
import { ServiceContext } from './context';
import 'graphql-iso-date';
///@ts-ignore
import schema from './schema.graphql';

const _main = async (event: APIGatewayEvent) => {
    const headers = {
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": true,
    };

    try 
    {        
        if (isNil(event.body)) {
            throw new Error('ERROR: There was no request body present');
        }

        const body = JSON.parse(event.body);
        const variables = get(body, 'variables', {});
        if (isEmpty(body.query) || !isString(body.query)) {
            throw new Error(`ERROR; There was not 'query' provided.`)
        }

        // Run the graphQL, i find it easier on the client if the request just fails 
        // if there are errors, so we'll map the 'errors' into an Error if it's non-empty
        const result = await graphql(buildASTSchema(schema),
                            body.query, 
                            root, 
                            new ServiceContext(event), 
                            variables);
        
        /*if (Array.isArray(result.errors)) {
            const messages = result.errors.map((error:any) => {
                    if (isString(error.message))
                        return error.message;
                    return String(error);
                });
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    code: "GRAPHQL_FAILURE",
                    errors: messages
                })
            };

        } else if (isString(result.errors)) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    code: "GRAPHQL_FAILURE",
                    errors:[ String(result.errors) ]
                })
            }
        }*/

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        }
    } 
    catch (error)
    {
        let message = String(error);
        if (error instanceof Error) 
            message = message.toString();
        else if (isString(error.message))
            message = error.message;


        const code = 'UNKNOWN_ERROR';

        return ({
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message,
                code
            })
        });
    }
}

exports.handler = async function (_event: any, _context: any) {
    console.log('handler');
    console.log(_context);
    console.log(process.env);
    //console.log(_context);
    //console.log(_event);
    if (typeof(_main) === 'function')
        return { statusCode: 200, body:"ok buddy" + JSON.stringify(process.env)};

    return "wft";
}
