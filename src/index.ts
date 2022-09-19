import Discord from 'discord.js';
import dotenv from 'dotenv';
import { AppDataSource } from './backend/data-source';
import client from './bot/client';
import InteractionRepository from 'src/bot/InteractionRepository';
import MessageInteraction from 'src/bot/MessageInteraction';

AppDataSource.initialize()
	.then(() => {
		console.log('Database Connected!');
	})
	.catch(() => {
		console.log('Database Connect Failed!');
	});

dotenv.config();
// PARAM token
const token = process.env.DISCORD_TOKEN;
// NOTE: 봇 실행시 실행
client.once('ready', () => {
	console.log('MEOW');
});

// FUNCTION 인터랙션 응답 설정
client.on('interactionCreate', async (interaction: Discord.Interaction) => {
	console.log('interaction Create');
	const interactionRepository = await InteractionRepository.builderFromInteraction(interaction);

	if (!interaction.isChatInputCommand()) return;

	switch (interaction.commandName) {
		case 'stats':
			await interaction.reply(`Server count: ${client.guilds.cache.size}.`);
			break;
		case 'meow':
			await interaction.reply(`으애애애애애옹`);
			break;
		case '김한얼':
			await interaction.reply('바보');
			break;
		case '이름변경':
			const newName = interaction.options.getString('name');
			interactionRepository.cat.setName(newName);
			await interaction.reply(`SYSTEM : 고양이의 이름은 ${newName}입니다.`);
			break;
		default:
			break;
	}
});

// NOTE: 작동함
client.on('messageCreate', MessageInteraction);

// FIXME: 상호작용 방법을 찾아야됨
client.on('message', (message) => {
	console.log(message.content);
});

client.login(token);

export default client;
