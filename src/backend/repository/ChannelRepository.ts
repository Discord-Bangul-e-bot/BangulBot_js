import Channel from 'src/backend/entity/Channel';
import { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';

@RepositoryDecorator<Channel>()
class ChannelRepository {
	model: Channel;

	public static getOrCreate(args: BaseModelQueryParam): Promise<Channel> {
		return new Promise<Channel>((resolve, reject) => {
			Channel.findOneByOrFail({ id: args.id })
				.then(async (model) => {
					if (this.name !== args.name) {
						await model.setName(args.name);
					}
					resolve(model);
				})
				.catch(async () => {
					const instance = Channel.create<Channel>({ id: args.id, name: DEFAULTCATNAME });
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	public static getOrCreateFromMessage(message: MessageBase): Promise<Channel> {
		const channel = message.channel;
		const channel_id = channel.id;
		let name: string;
		if (channel.isDMBased()) {
			name = 'default';
		} else {
			name = channel.name;
		}
		return new Promise<Channel>((resolve, reject) => {
			ChannelRepository.getOrCreate({ id: channel_id, name: name }).then(resolve).catch(reject);
		});
	}

	getName() {
		return this.model.name;
	}

	async setName(name: string) {
		this.model.name = name;
		await this.model.save();
		return;
	}
}

export default ChannelRepository;
