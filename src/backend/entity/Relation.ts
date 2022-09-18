import Discord from 'discord.js';
import BaseModel from 'src/backend/entity/BaseModel';
import Cat from 'src/backend/entity/Cat';
import User from 'src/backend/entity/User';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
class Relation extends BaseModel {
	@ManyToOne((type) => Cat, (cat) => cat.relations, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'cat_id' })
	cat: Cat;

	@ManyToOne((type) => Cat, (user) => user.relations, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ default: 0 })
	intimacy: number;

	static getRelation(args: { user: User; cat: Cat }) {
		return new Promise<Relation>((resolve, reject) => {
			Relation.findOneByOrFail({
				cat: { id: args.cat.id },
				user: { id: args.user.id },
			})
				.then(resolve)
				.catch(async () => {
					const instance = Relation.create<Relation>({ cat: args.cat, user: args.user, name: 'default' });
					instance.save().then(resolve).catch(reject);
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
}

export default Relation;
