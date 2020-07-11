const nanoid = require('nano-id');

export class Note {
	public readonly noteId: string;
	private readonly _createdAt: string;
	private _updatedAt: string;
	public content: string|null = null;
	public userId: string;
	public attachment: string|null = null;

	constructor(user: string) {
		this.userId = user;
		this.noteId = nanoid(12);
		this._createdAt = (new Date()).toJSON();
		this._updatedAt = this._createdAt;
	}

	public get createdAt() {
		return new Date(this._createdAt);
	}

	public get updatedAt() {
		return new Date(this._updatedAt);
	}

	setUpdate() {
		this._updatedAt = (new Date()).toJSON();
	}

}