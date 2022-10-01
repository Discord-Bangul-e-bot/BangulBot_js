import { AfterInsert, BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';
import Discord from 'discord.js';
import User from 'src/backend/entity/User';
import { MessageBase } from 'src/backend/types';

@Entity()
class Message extends BaseModel {
	@Column('text')
	message: string;

	@ManyToOne((type) => User, (user) => user.messages, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	static createFromInteraction(interaction: MessageBase) {
		return new Promise<Message>(async (resolve, reject) => {
			const author = interaction.author;
			const id = author.id;
			const message = interaction.content;
			User.findOneByOrFail({ id })
				.then(async (user) => {
					const instance = Message.create({ user, message, name: 'message' });
					const saved = await instance.save();
					resolve(saved);
				})
				.catch(() => {
					reject();
				});
		});
	}
}

export default Message;
