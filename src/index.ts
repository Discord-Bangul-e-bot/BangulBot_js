import Discord from 'discord.js';
import dotenv from 'dotenv';
import { AppDataSource } from './backend/data-source';
import client from './bot/client';
import MessageInteraction from './bot/MessageInteraction';

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

// FIXME: 상호작용 방법을 찾아야됨
client.on('interactionCreate', async (interaction: Discord.Interaction) => {
	console.log('interaction Create');
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'stats') {
		await interaction.reply(`Server count: ${client.guilds.cache.size}.`);
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
