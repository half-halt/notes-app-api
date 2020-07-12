/* eslint-disabled */
const readline = require('readline')
const faunadb = require('faunadb')
const chalk = require('chalk')
const q = faunadb.query;
require('dotenv').config('../.env');


// Retrive our environment key
function getFaunaKey()
{
	const key = process.env.FAUNADB_ADMIN_KEY;
	if (!key || key.length ===  0)
	{
		console.error(chalk.red('Unable to find FAUNADB_ADMIN_key.'))
		process.exit();
	}

	return key;
}

async function createIndex(client, indexName, indexParams)
{
	console.log(`Creating index: '${chalk.green(indexName)}'`);

	try
	{
		const result = await client.query(
			q.Select('ref', q.Get(
				q.Index(indexName)
			))
		);

		console.log(`  -> Using existing index: '${chalk.yellow(result)}'`);
		return result;
	}
	catch (error)
	{
		if (error.message !== 'invalid ref')
			throw error;
	}

	const index = await client.query(
		q.Select(
			'ref',
			q.CreateIndex({
				...indexParams,
				name: indexName
			})
		)
	);

	console.log(`  -> Created index: '${chalk.yellow(index)}'`);
	return index;
}

async function createCollection(client, collectionName, collectionParams = {})
{
	console.log(`Creating collection: '${chalk.green(collectionName)}'`);

	// 0: See if we can find a collection with the specified name
	try
	{
		const result = await client.query(
			q.Select(
				'ref', 
				q.Get(q.Collection(collectionName))
			)
		);

		if (result)
		{
			console.log(`  -> using existing collection: ${chalk.yellow(result)}`);
			return result;
		}
	}
	catch (error)
	{
		if (error.message !== 'invalid ref')
			throw error;
	}

	// 1: Need to create a new collection
	const result = await client.query(
		q.Select('ref', 
			q.CreateCollection({
				...collectionParams,
				name: collectionName
			})
		)
	);

	console.log(`  -> created collection: ${chalk.yellow(result)}`);
	return result;
}

/* idempotent operation */
async function createFaunaDB(key) 
{
	console.log(`Connecting to database key='${chalk.green(key)}'`);
	const client = new faunadb.Client({ secret: key	});
	try
	{
		const usersRef = await createCollection(client, 'Users');
		await createIndex(client, 'Users_BySub', {
			permissions:{
				read: usersRef,				
			},
			source: usersRef,
			terms:[
				{
					field: ['data', 'sub']
				}
			],
			unique: true
		});

		await createIndex(client, 'Users_All', {
			source: usersRef,
			permissions:{
				read: usersRef
			}
		});

		const notesRef = await createCollection(client, 'Notes', {
			permissions:{
				create: usersRef,
				read: usersRef,
				delete: usersRef
			}
		});

		await createIndex(client, 'Notes_All', {
			source: notesRef,
			permissions:{
				read: usersRef
			}
		});

		await createIndex(client, 'Notes_ByOwner', {
			permissions:{
				read: usersRef,
			},
			source: notesRef,
			terms:[
				{
					field: ['data', 'owner']
				}
			]
		});

		await createIndex(client, 'Note_ByOwnerAndId', {
			permissions:{
				read: usersRef,
			},
			source: notesRef,
			terms:[
				{
					field: ['data', 'owner']
				},
				{
					field: ['ref']
				}
			],
			unique: true
		});
	}
	catch (error)
	{
		console.error(`Failed to initialize the database`);
		console.error(error);
	}
	console.log();
}

// Readline util
function ask(question, callback) {
  const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
  });

  rl.question(question + '\n', (answer)  =>  {
	rl.close();
	callback(null, answer);
  });
}

console.log(chalk.cyan('Ensuring database...'));
createFaunaDB(getFaunaKey());