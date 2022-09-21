import Discord from 'discord.js';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';
import { MessageBase } from '../types';
import Cat from 'src/backend/entity/Cat';

@Entity()
class Channel extends BaseModel {
	@Column({ default: true })
	permission: boolean;

	@ManyToOne((type) => Cat, (cat) => cat.channels, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'cat_id' })
	cat: Cat;

	static _create({ id, name, cat_id }: { id: string; name: string; cat_id: string }) {
		const channel = new Channel();
		channel.id = id;
		channel.name = name;
		const cat = new Cat();
		cat.id = cat_id;
		channel.cat = cat;
		return channel;
	}

	async setName(name: string) {
		this.name = name;
		return this.save();
	}
}

export default Channel;
