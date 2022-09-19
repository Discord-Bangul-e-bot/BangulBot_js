import Discord from 'discord.js';
import dotenv from 'dotenv';
import { MessageBase } from 'src/backend/types';
import InteractionRepository from 'src/bot/InteractionRepository';
dotenv.config();

// NOTE: Client에서 사용 할 기능들을 래핑해줌
class MyClient extends Discord.Client {
	static isCreated: boolean = false;
	static instance: MyClient | null = null;

	constructor(options: Discord.ClientOptions) {
		if (!MyClient.isCreated) {
			super(options);
			MyClient.instance = this;
		} else {
			return MyClient.instance;
		}
	}

	isBotMessge(interaction: Discord.Message) {
		console.log(this.user);
		console.log(interaction.author);
		return true;
	}

	getCommandFromMessage(message: MessageBase, InteractionRepository: InteractionRepository) {
		const messageContent = message.content;
		const result = {
			acceptable: false,
			command: '',
		};
		// if (this.isBotMessge(interaction)) return result;
		if (!messageContent.startsWith(InteractionRepository.cat.name)) return result;
		const message_split = messageContent.split(' ');
		if (message_split.length == 1) return result;
		const command = message_split.splice(1, message_split.length - 1).join(' ');
		return { acceptable: true, command };
	}
}

export default MyClient;
