import { Storage } from './storage-t';
import { Note } from '../models';
import { Client, query as q } from 'faunadb';

const KEY = 'fnADwV1RpfACDaS66dGQBxcrtBduWmnbxsQu1-v-'; // cspell:disable-line

const client = new Client({
  secret: KEY
});



class NoteStorage extends Storage<Note> {
	constructor() {
		super('notes', Note);
	}

	async put(object: Note) : Promise<Note> 
	{	
		client.query(q.Create(q.Collection('notes'), { data: object }))
			.then((item: any) => console.log(item, 'ref=', JSON.stringify(item.ref), item.ref.id))
			.catch((error) => console.error(error));

			client.query(
				  q.Match(q.Index('notes_ByUser'), object.userId)
			  ).then((ret) => console.log(ret))		
			  .catch(error => console.error(error));
		
		return super.put(object);
	}
}

export const NoteStore = new NoteStorage();