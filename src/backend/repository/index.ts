import { BaseEntity } from 'typeorm';
import { MessageBase } from 'src/backend/types';
import BaseModel from 'src/backend/entity/BaseModel';

export function staticImplements<T>() {
	return <U extends T>(constructor: U) => {
		constructor;
	};
}

export interface RepositoryStatic<T extends BaseModel> {
	getOrCreateFromMessage(message: MessageBase): Promise<T>;
	getOrCreate(arg: Partial<T>): Promise<T>;
	// new (): BaseRepository<T>;
}

export function RepositoryDecorator<T extends BaseModel>() {
	return staticImplements<RepositoryStatic<T>>();
}

interface BaseRepository<T extends BaseModel> {
	model: T;
	getName(): string;
	setName(name: string): Promise<void>;
}

export default BaseRepository;
