import Discord from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// TODO: .env에서 설정해주세요~!@
const PREFIX = process.env.PREFIX || '고양이';

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

	getCommandFromMessage(interaction: Discord.Message) {
		const messageContent = interaction.content;
		const result = {
			acceptable: false,
			command: '',
		};
		// if (this.isBotMessge(interaction)) return result;
		if (!messageContent.startsWith(PREFIX)) return result;
		const message_split = messageContent.split(' ');
		if (message_split.length == 1) return result;
		const command = message_split.splice(1, message_split.length - 1).join(' ');
		return { acceptable: true, command };
	}
}

export default MyClient;
