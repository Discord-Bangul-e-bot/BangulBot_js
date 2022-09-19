import User from 'src/backend/entity/User';
import { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';

@RepositoryDecorator<User>()
class UserRepository {
	model: User;

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

	getName() {
		return this.model.name;
	}

	async setName(name: string) {
		this.model.name = name;
		await this.model.save();
		return;
	}
}

export default UserRepository;
