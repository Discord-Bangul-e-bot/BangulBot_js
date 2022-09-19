import Cat from 'src/backend/entity/Cat';
import { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';

@RepositoryDecorator<Cat>()
class CatRepository {
	model: Cat;

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

	getName() {
		return this.model.name;
	}

	async setName(name: string) {
		this.model.name = name;
		await this.model.save();
		return;
	}
}

export default CatRepository;
