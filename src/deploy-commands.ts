import dotenv from 'dotenv';

import { SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';

dotenv.config();
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

// FUNCTION slash command builder
const makeCommand = (name: string, desc: string) => {
	const newCommand = new SlashCommandBuilder().setName(name).setDescription(desc);
	return newCommand;
};
// FUNCTION command after text input
const makeInput = (func: any, name: string, desc: string, required: boolean) => {
	const newCommand = func.addStringOption((option) => option.setName(name).setDescription(desc).setRequired(required));
	return newCommand;
};

// PARAM 명령어 등록
// TODO 명령어 등록 할 것 정해서 등록하기
const commands = [
	makeCommand('meow', '고양이가 야옹을 해요'),
	makeCommand('stats', '서버 상태 명령어'),
	makeCommand('김한얼', '???'),
	makeInput(makeCommand('이름변경', '고양이 이름을 바꿔봐요'), 'name', '이름을 입력해주세요', true),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest
	.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data: any) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
