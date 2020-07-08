import { hello }  from '../handler';
import { APIGatewayEvent, Context } from 'aws-lambda';

test('hello', async () => {

  const response = await hello({} as APIGatewayEvent , {} as Context);
  expect(response.statusCode).toEqual(200);
  expect(typeof response.body).toBe("string");
});
