import Discord from 'discord.js';
import { Column, Entity } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';
import { MessageBase } from '../types';

@Entity()
class Channel extends BaseModel {
	@Column({ default: true })
	permission: boolean;

	async setName(name: string) {
		this.name = name;
		return this.save();
	}
}

export default Channel;
