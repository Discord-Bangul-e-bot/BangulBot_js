import Discord from 'discord.js';
import { Column, DeepPartial, Entity, FindOneOptions, OneToMany } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';
import Relation from 'src/backend/entity/Relation';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
@Entity()
class Cat extends BaseModel {
	@OneToMany((type) => Relation, (relation) => relation.cat)
	relations: Relation[];

	@Column()
	hungry: number;

	static getOrCreate(arg: { id: number; name: string }) {
		return new Promise<Cat>((resolve, reject) => {
			Cat.findOneByOrFail({ id: arg.id })
				.then(resolve)
				.catch(async () => {
					const instance = Cat.create<Cat>(arg);
					const savedInstance = await instance.save();
					resolve(savedInstance);
				});
		});
	}

	static getOrCreateFromMessage(message: Discord.Message) {
		const guild = message.guild;
		const guild_id = parseInt(guild.id, 10);
		const name = guild.name;
		return new Promise<Cat>((resolve, reject) => {
			Cat.getOrCreate({ id: guild_id, name: name }).then(resolve).catch(reject);
		});
	}
}

export default Cat;
