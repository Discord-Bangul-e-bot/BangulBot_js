import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseModel from './BaseModel';
import Discord from 'discord.js';
import User from './User';
import { AppDataSource } from '../data-source';

@Entity()
class Message extends BaseModel {
	@Column('text')
	message: string;

	@ManyToOne((type) => User, (user) => user.messages, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	static createFromInteraction(interaction: Discord.Message) {
		return new Promise<Message>(async (resolve, reject) => {
			const author = interaction.author;
			const id = parseInt(author.id, 10);
			const message = interaction.content;
			console.log(id);
			User.findOneByOrFail({ id })
				.then(async (user) => {
					const instance = Message.create({ user, message, name: 'message' });
					const saved = await instance.save();
					console.log('messageCreated!');
					resolve(saved);
				})
				.catch(() => {
					console.log('messageNotCreated');
					reject();
				});
		});
	}
}

export default Message;
