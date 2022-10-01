import Discord, { Client } from 'discord.js';
import Cat from 'src/backend/entity/Cat';
import BaseRepository, { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';

@RepositoryDecorator<Cat>()
class CatRepository extends BaseRepository<Cat> {
	model: Cat;

	constructor(model: Cat) {
		super(model);
	}
	/**
	 *
	 * @param client
	 * @param cb 디스코드의 급식소 채널에 수행할 콜백 코드입니다 ex: (interaction:Discord.TextBaseChannel,cat:Cat)=>{
	 * 		interaction.send("고양이는 배고파요")
	 * }
	 */

	announceHungry(client: Client, cb: (interaction: Discord.TextBasedChannel, cat: Cat) => void) {
		if (this.model.isHungry()) {
			for (const channel of this.model.channels) {
				if (channel.name == '급식소') {
					const interaction = client.channels.cache.get(channel.id);
					if (interaction.isTextBased()) {
						cb(interaction, this.model);
					}
				}
			}
		}
	}

	public static getOrCreate(args: BaseModelQueryParam): Promise<Cat> {
		return new Promise<Cat>((resolve, reject) => {
			Cat.findOneByOrFail({ id: args.id })
				.then((cat) => resolve(cat))
				.catch(async () => {
					const instance = Cat.create<Cat>({ id: args.id, name: DEFAULTCATNAME });
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	public static getOrCreateFromMessage(message: MessageBase): Promise<Cat> {
		const guild = message.guild;
		const guild_id = guild.id;
		const name = guild.name;
		return new Promise<Cat>((resolve, reject) => {
			CatRepository.getOrCreate({ id: guild_id, name: name }).then(resolve).catch(reject);
		});
	}

	public static getAll(): Promise<Cat[]> {
		return new Promise<Cat[]>(async (resolve, reject) => {
			const cats = await Cat.find();
			resolve(cats);
		});
	}
}

export default CatRepository;
