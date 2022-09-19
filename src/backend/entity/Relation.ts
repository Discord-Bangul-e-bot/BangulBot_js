import Discord from 'discord.js';
import BaseModel from 'src/backend/entity/BaseModel';
import Cat from 'src/backend/entity/Cat';
import User from 'src/backend/entity/User';
import { AfterInsert, BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
class Relation extends BaseModel {
	@ManyToOne((type) => Cat, (cat) => cat.relations, { onDelete: 'CASCADE', eager: true, nullable: false })
	@JoinColumn({ name: 'cat_id' })
	cat: Cat;

	@ManyToOne((type) => User, (user) => user.relations, { onDelete: 'CASCADE', eager: true, nullable: false })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ default: 0 })
	intimacy: number;

	async increaseIntimacy(amount = 1) {
		if (!this.setIntimacyAvailable(amount)) {
			return false;
		}
		await this.setIntimacy(amount);
		return true;
	}

	async decreaseIntimacy(amount = 1) {
		if (!this.setIntimacyAvailable(-amount)) {
			return false;
		}
		await this.setIntimacy(-amount);
		return true;
	}

	setIntimacyAvailable(amount: number) {
		const target = this.intimacy + amount;
		if (0 > target) {
			return false;
		} else {
			return true;
		}
	}

	private async setIntimacy(amount: number) {
		this.intimacy += amount;
		await this.save();
	}

	static getRelation(args: { user: User; cat: Cat }) {
		return new Promise<Relation>((resolve, reject) => {
			Relation.findOneByOrFail({
				cat: { id: args.cat.id },
				user: { id: args.user.id },
			})
				.then(resolve)
				.catch(async () => {
					console.log('relation create!');
					console.table(args);
					const instance = Relation.createDefault({ cat: args.cat, user: args.user });
					console.log('instance create!');
					await instance.save();
					resolve(instance);
				});
		});
	}
	static getRelationFromMessage(message: Discord.Message) {
		return new Promise(async (resolve, reject) => {
			const user = await User.getOrCreateFromMessage(message);
			const cat = await Cat.getOrCreateFromMessage(message);
			Relation.getRelation({ user, cat }).then(resolve).catch(reject);
		});
	}
	private static createDefault({ cat, user }: { cat: Cat; user: User }) {
		const instance = new Relation();
		instance.user = user;
		instance.cat = cat;
		instance.intimacy = 0;
		instance.name = 'relation';
		return instance;
	}
}

export default Relation;
