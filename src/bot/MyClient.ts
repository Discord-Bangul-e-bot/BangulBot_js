import Discord from 'discord.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import CatRepository from 'src/backend/repository/CatRepository';
import { MessageBase } from 'src/backend/types';
import InteractionRepository from 'src/bot/InteractionService';
dotenv.config();

type CommandFromMessage = {
	acceptable: boolean;
	command: string;
	arguments: string[];
};

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
	/**
	 * 주기적 태스크를 실행함
	 */
	cronTask() {
		const client = this;
		/**
		 * 초 분 시 일 월 년
		 */
		cron.schedule('0 * * * * *', () => {
			CatRepository.getAll().then((cats) => {
				for (const cat of cats) {
					cat.increaseHungry();
					cat.save();
					console.log(`${cat.getName()}의 배고픔 + 1`);
				}
			});
		});
		cron.schedule('0 0 * * * *', () => {
			CatRepository.getAll().then((cats) => {
				for (const cat of cats) {
					cat.repository.announceHungry(client, (interaction, cat) => {
						interaction.send(`${cat.getName()}은 배고파요`);
						interaction.send(`야옹`);
					});
				}
			});
		});
		for (const task of cron.getTasks()) {
			task[1].start();
		}
	}

	isBotMessge(message: MessageBase) {
		return process.env.CLIENT_ID === message.author.id;
	}

	getCommandFromMessage(message: MessageBase, interactionRepository: InteractionRepository) {
		const messageContent = message.content;
		const result: CommandFromMessage = {
			acceptable: false,
			command: '',
			arguments: [],
		};
		if (this.isBotMessge(message)) return result;
		if (!messageContent.startsWith(interactionRepository.cat.getName())) return result;

		const message_split = messageContent.split(' ');
		if (message_split.length == 1) return result;
		const command = message_split.splice(1, 2)[0];
		const args = messageContent.split(' ').splice(2);

		return { acceptable: true, command, arguments: args };
	}
}

export default MyClient;
