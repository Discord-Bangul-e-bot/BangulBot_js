import Discord from 'discord.js';
import { Column, Entity } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';

@Entity()
class Channel extends BaseModel {
	@Column({ default: true })
	permission: boolean;

	static getOrCreate(arg: { id: number; name: string }) {
		return new Promise<Channel>((resolve, reject) => {
			Channel.findOneByOrFail({ id: arg.id })
				.then(resolve)
				.catch(async () => {
					const instance = Channel.create<Channel>(arg);
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	static getOrCreateFromMessage(message: Discord.Message) {
		const channel = message.channel;
		const guild_id = parseInt(channel.id, 10);
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
}

export default Channel;
