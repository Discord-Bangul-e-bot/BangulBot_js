import Discord from 'discord.js';
import BaseModel from 'src/backend/entity/BaseModel';
import Message from 'src/backend/entity/Message';
import Relation from 'src/backend/entity/Relation';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

@Entity()
class User extends BaseModel {
	@Column({ default: 0 })
	coin: number;

	@OneToMany((type) => Message, (message) => message.user)
	messages: Message[];

	@OneToMany((type) => Relation, (relation) => relation.user)
	relations: Relation[];

	@BeforeInsert()
	beforeInsertActions() {
		this.coin = 0;
	}

	static getOrCreate(arg: { id: number; name: string }) {
		return new Promise<User>((resolve, reject) => {
			User.findOneByOrFail({ id: arg.id })
				.then((user) => {
					console.log('getUserFroMDB!');
					resolve(user);
				})
				.catch(async () => {
					console.log('createUser!!');
					const instance = User.create<User>(arg);
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	static getOrCreateFromMessage(message: Discord.Message) {
		return new Promise<User>((resolve, reject) => {
			const author = message.author;
			const id = parseInt(author.id, 10);
			const name = author.username;
			User.getOrCreate({ id, name }).then(resolve).catch(reject);
		});
	}

	async increaseCoin(amount: number) {
		this.coin += amount;
		const saved = await this.save();
		return saved;
	}

	async decreaseCoin(amount: number) {
		if (this.coin - amount < 0) {
			return false;
		} else {
			this.coin += amount;
			const saved = await this.save();
			return saved;
		}
	}
}

export default User;
