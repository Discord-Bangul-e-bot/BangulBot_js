import Channel from 'src/backend/entity/Channel';
import BaseRepository, { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';

@RepositoryDecorator<Channel>()
class ChannelRepository extends BaseRepository<Channel> {
	model: Channel;

	constructor(model: Channel) {
		super(model);
	}

	public static getOrCreate(args: BaseModelQueryParam & { cat_id: string }): Promise<Channel> {
		return new Promise<Channel>((resolve, reject) => {
			Channel.findOneByOrFail({ id: args.id })
				.then(async (model) => {
					if (this.name !== args.name) {
						await model.setName(args.name);
					}
					resolve(model);
				})
				.catch(async () => {
					const instance = Channel._create({ id: args.id, cat_id: args.cat_id, name: DEFAULTCATNAME });
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	public static getOrCreateFromMessage(message: MessageBase): Promise<Channel> {
		const channel = message.channel;
		const channel_id = channel.id;
		const cat_id = message.guild.id;
		let name: string;
		if (channel.isDMBased()) {
			name = 'default';
		} else {
			name = channel.name;
		}
		return new Promise<Channel>((resolve, reject) => {
			ChannelRepository.getOrCreate({ id: channel_id, name: name, cat_id: cat_id }).then(resolve).catch(reject);
		});
	}
}

export default ChannelRepository;
