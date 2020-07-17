import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import { rootModule } from './modules/root-module';

const server = new ApolloServer({
    modules: [rootModule],
    context: session => session
});

exports.handler = server.createHandler({
	cors:{
		origin: '*',
		credentials: true,
		methods: 'POST'
	}
});

/*exports.handler = (event: APIGatewayProxyEvent, context: any, callback: Callback<APIGatewayProxyResult>) => {
    log.info('Entering notes API handler');
    apolloHandler(event, context, (result) => {

        console.log(result);
        log.info('Leaving notes API handler');
        callback(result);
    });
}*/
