import { APIGatewayProxyEvent } from 'aws-lambda';
import { log } from '~/utils/log';

exports.handler = function(event: APIGatewayProxyEvent, _context: any, callback: CallableFunction)
{
	log.info('Begin pusher authentication request');
	log.info('event: %s', event);
	callback(null, { statusCode: 500, body: "not implemented"});
}