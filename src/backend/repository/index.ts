import { BaseEntity } from 'typeorm';
import { MessageBase } from 'src/backend/types';
import BaseModel from 'src/backend/entity/BaseModel';

abstract class BaseRepository<T extends BaseModel> {
	model: T;
	constructor(model: T) {
		this.model = model;
	}
	getName(): string {
		return this.model.name;
	}
	async setName(name: string): Promise<T> {
		return await this.model.save();
	}
}

export interface RepositoryStatic<T extends BaseModel> {
	getOrCreateFromMessage(message: MessageBase): Promise<T>;
	getOrCreate(arg: Partial<T>): Promise<T>;
	new (model: T): BaseRepository<T>;
}

export function staticImplements<T>() {
	return <U extends T>(constructor: U) => {
		constructor;
	};
}

export function RepositoryDecorator<T extends BaseModel>() {
	return staticImplements<RepositoryStatic<T>>();
}

export default BaseRepository;
