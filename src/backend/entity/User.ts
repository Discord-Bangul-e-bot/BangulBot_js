import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';
import Discord from 'discord.js';
import Message from 'src/backend/entity/Message';
import Relation from 'src/backend/entity/Relation';

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

	static createOrGetFromInteraction(interaction: Discord.Message) {
		return new Promise<User>((resolve, reject) => {
			const author = interaction.author;
			const id = parseInt(author.id, 10);
			const name = author.username;
			User.findOneByOrFail({ id })
				.then(async (user) => {
					console.log('get exist User!');
					user.name = name;
					await user.save();
					resolve(user);
				})
				.catch(async () => {
					const instance = User.create({ id, name });
					const savedInstance = await instance.save();
					console.log('create new User!');
					resolve(savedInstance);
				})
				.catch(() => reject());
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
