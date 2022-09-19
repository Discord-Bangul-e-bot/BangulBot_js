import Discord from 'discord.js';
import { Column, Entity } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';
import { MessageBase } from '../types';

@Entity()
class Channel extends BaseModel {
	@Column({ default: true })
	permission: boolean;

	static getOrCreate(args: { id: string; name: string }) {
		return new Promise<Channel>((resolve, reject) => {
			Channel.findOneByOrFail({ id: args.id })
				.then(async (channel) => {
					if (channel.name !== args.name) {
						await channel.setName(args.name);
					}
					resolve(channel);
				})
				.catch(async () => {
					const instance = Channel.create<Channel>(args);
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	static getOrCreateFromMessage(message: MessageBase) {
		const channel = message.channel;
		const guild_id = channel.id;
		let name: string;
		if (channel.isDMBased()) {
			name = 'default';
		} else {
			name = channel.name;
		}
		return new Promise<Channel>((resolve, reject) => {
			Channel.getOrCreate({ id: guild_id, name: name }).then(resolve).catch(reject);
		});
	}

	private async setName(name: string) {
		this.name = name;
		return this.save();
	}
}

export default Channel;
