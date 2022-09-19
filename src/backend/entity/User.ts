import Discord from 'discord.js';
import BaseModel from 'src/backend/entity/BaseModel';
import Message from 'src/backend/entity/Message';
import Relation from 'src/backend/entity/Relation';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { MessageBase } from '../types';

@Entity()
class User extends BaseModel {
	@Column({ default: 0 })
	coin: number;

	@OneToMany((type) => Message, (message) => message.user, { cascade: true })
	messages: Message[];

	@OneToMany((type) => Relation, (relation) => relation.user, { cascade: true })
	relations: Relation[];

	@BeforeInsert()
	beforeInsertActions() {
		this.coin = 0;
	}

	private static getOrCreate(args: { id: string; name: string }) {
		return new Promise<User>((resolve, reject) => {
			User.findOneByOrFail({ id: args.id })
				.then(async (user) => {
					console.log('getUserFroMDB!');
					if (this.name !== args.name) {
						await user.setName(args.name);
					}
					resolve(user);
				})
				.catch(async () => {
					console.log('createUser!!');
					const instance = User.create<User>(args);
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	static getOrCreateFromMessage(message: MessageBase) {
		return new Promise<User>((resolve, reject) => {
			const author = message.author;
			const id = author.id;
			const name = author.username;
			User.getOrCreate({ id, name }).then(resolve).catch(reject);
		});
	}

	private async setName(name: string) {
		this.name = name;
		return this.save();
	}

	async increaseCoin(amount: number) {
		if (!this.setCoinAvailable(amount)) {
			return false;
		}
		this.setCoin(amount);
		return true;
	}

	async decreaseCoin(amount: number) {
		if (!this.setCoinAvailable(-amount)) {
			return false;
		}
		this.setCoin(-amount);
		return true;
	}

	setCoinAvailable(amount: number) {
		const target = this.coin + amount;
		if (0 > target) {
			return false;
		}
		return true;
	}

	async setCoin(amount: number) {
		this.coin += amount;
		return await this.save();
	}

	buyAvailable(coin: number) {
		return this.coin - coin;
	}
}

export default User;
