import User from 'src/backend/entity/User';
import BaseRepository, { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';

@RepositoryDecorator<User>()
class UserRepository extends BaseRepository<User> {
	model: User;

	constructor(model: User) {
		super(model);
	}

	public static getOrCreate(args: BaseModelQueryParam): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			User.findOneByOrFail({ id: args.id })
				.then(async (model) => {
					if (this.name !== args.name) {
						await model.setName(args.name);
					}
					resolve(model);
				})
				.catch(async () => {
					const instance = User.create<User>({ id: args.id, name: DEFAULTCATNAME });
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	public static getOrCreateFromMessage(message: MessageBase): Promise<User> {
		const author = message.author;
		const author_id = author.id;
		const name = author.username;
		return new Promise<User>((resolve, reject) => {
			UserRepository.getOrCreate({ id: author_id, name: name }).then(resolve).catch(reject);
		});
	}

	async increaseCoin(amount: number) {
		if (!this.setCoinAvailable(amount)) {
			return false;
		}
		await this.model.setCoin(amount);
		return true;
	}

	async decreaseCoin(amount: number) {
		if (!this.setCoinAvailable(-amount)) {
			return false;
		}
		await this.model.setCoin(-amount);
		return true;
	}

	setCoinAvailable(amount: number = 1) {
		const target = this.model.coin + amount;
		if (0 > target) {
			return false;
		}
		return true;
	}
}

export default UserRepository;
