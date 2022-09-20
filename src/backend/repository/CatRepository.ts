import Cat from 'src/backend/entity/Cat';
import BaseRepository, { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';
import User from '../entity/User';

@RepositoryDecorator<Cat>()
class CatRepository extends BaseRepository<Cat> {
	model: Cat;

	constructor(model: Cat) {
		super(model);
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
}

export default CatRepository;
