import AWS from 'aws-sdk';
import { isNil } from 'lodash';

const dbClient = new AWS.DynamoDB.DocumentClient();
type ConstructorT<T extends Object = {}> = new (...args: any[]) => T;

export abstract class Storage<T extends Object>
{
	private _table: string;
	private _ctor: ConstructorT<T>;

	constructor(table: string, ctor: ConstructorT<T>) {
		this._table = table;
		this._ctor = ctor;
	}

	get(params: Omit<AWS.DynamoDB.DocumentClient.GetItemInput, 'TableName'>): Promise<T|null> {
		return new Promise(
		   (resolve, reject) => {
		
			dbClient.get({
				...params,
				TableName: this._table
			}).promise().then(
				(result) => {
					console.log('result', result);
					if (!isNil(result.Item)) {
						resolve(Object.assign(new  this._ctor(), result.Item as any));
					} else {
						resolve(null);
					}
				},
				reject
			)
		});
	}

	async put(object: T) : Promise<T> {
		return new Promise(
			(resolve, reject) => {
				dbClient.put({
					TableName: this._table,
					Item: object
				}).promise().then(
					() => resolve(object),
					reject
				);
		});
	}

	query(params: Omit<AWS.DynamoDB.DocumentClient.QueryInput, 'TableName'>): Promise<T[]> {
		return new Promise(
			(resolve, reject) => {
				dbClient.query({
					...params,
					TableName: this._table
				}).promise().then(
					(result) => {
						console.log('result:', result);
						resolve(!isNil(result.Items) ?
						 result.Items.map((i) => Object.assign(new this._ctor(), i) as T) : 
						 [])
					},
					reject
				);
		})
	}

	update(params: Omit<AWS.DynamoDB.DocumentClient.UpdateItemInput, 'TableName'>): Promise<boolean> {
		return new Promise(
			(resolve, reject) => {
				dbClient.update({
					...params,
					TableName: this._table
				}).promise().then(
					() => resolve(true),
					reject
				);
		});
	}

	delete(params: Omit<AWS.DynamoDB.DocumentClient.DeleteItemInput, 'TableName'>): Promise<boolean> {
		return new Promise(
			(resolve, reject) => {
				dbClient.delete({
					...params,
					TableName: this._table
				}).promise().then(
					() => resolve(true),
					reject
				);
		});
	}
}